import com.fastcgi.FCGIInterface;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.Map;
import java.util.HashMap;
import java.net.URLDecoder;


public class Response {
    Logger logger = Logger.getLogger(this.getClass().getName());
    JsonParser jsonParser = new JsonParser();

    public void answer(String postData, String method) {
        if (method == null) {
            logFunc("Nothing to read!");
            logFunc("Method not specified");
        }

        if (method.equals("POST")) {
            try {


                List<String> xValues = jsonParser.parseX(postData);
                Integer yValue = Integer.valueOf(jsonParser.parseY(postData));
                Integer rValue = Integer.valueOf(jsonParser.parseR(postData));
                logFunc("xValues: " + xValues.toString());
                logFunc("yValue: " + yValue);
                logFunc("rValue: " + rValue);


                // Извлекаем нужные параметры
                if (!xValues.isEmpty()) {
                    StringBuilder ans = new StringBuilder();
                    for (int i = 0; i < xValues.size(); i++) {
                        String httpResponse;
                        Calculator calculator = new Calculator();
                        if (calculator.calculating(Integer.valueOf(xValues.get(i)), yValue, rValue)) {
                            httpResponse = String.format(
                                    "{\"hit\": %d, \"x\": %d, \"y\": %d, \"sum\": %d}",
                                    5, 1, 0, 1
                            );
                        }
                        else {
                            httpResponse = String.format(
                                    "{\"hit\": %d, \"x\": %d, \"y\": %d, \"sum\": %d}",
                                    5, 0, 0, 0
                            );
                        }
                        ans.append(httpResponse).append("\n");
                        logFunc("httpResponse: " + httpResponse);
                        logFunc("ans: " + ans);



                    }
                    sendSuccessResponse(String.valueOf(ans));




                } else {
                    sendSuccessResponse(String.format(
                            "{\"hit\": %d, \"x\": %d, \"y\": %d, \"sum\": %d}",
                            6, 0, 0, 0
                    ));
                }

            } catch (Exception e) {
                logFunc("Error processing POST: " + e.getMessage());
                logFunc("Internal server error");
            }
        }

        logFunc("Method not allowed");
    }






    public String sendSuccessResponse(String body) {
        System.out.println("Content-Type: application/json");
        System.out.println("Status: 200 OK");
        System.out.println();
        System.out.println(body);
        return "";
    }

    public String sendError(int statusCode, String message) {
        String errorJson = String.format("{\"error\": \"%s\"}", message);
        System.out.println("Content-Type: application/json");
        System.out.println("Status: " + statusCode + " " + message);
        System.out.println();
        System.out.println(errorJson);
        return "";
    }

    public void logFunc(String st) {
        logger.info(st);
    }
}