import com.fastcgi.FCGIInterface;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
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
        long startTime = System.currentTimeMillis();
        if (method == null) {
            logFunc("Nothing to read!");
            logFunc("Method not specified");
        }

        if (method.equals("POST")) {
            try {


                List<String> xValues = jsonParser.parseX(postData);
                String yVal = jsonParser.parseY(postData);
                Double yValue = Double.valueOf(yVal);
                logFunc("yVal: " + yVal);
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
                        long endTime = System.currentTimeMillis();
                        if (calculator.calculating(Integer.valueOf(xValues.get(i)), yValue, rValue)) {
                            httpResponse = String.format(
                                    "{\"x\": %s, \"y\": %s, \"r\": %s, \"control\": %d, \"timeOfProcess\": %d}",
                                    xValues.get(i), yVal, rValue, 1, endTime - startTime
                            );
                        }
                        else {
                            httpResponse = String.format(
                                    "{\"x\": %s, \"y\": %s, \"r\": %s, \"control\": %d, \"timeOfProcess\": %d}",
                                    xValues.get(i), yVal, rValue, 0, endTime - startTime
                            );
                        }
                        if (i == 0) {
                            ans.append("[").append(httpResponse).append(",\n");
                        }
                        else if (i != xValues.size() - 1) {
                            ans.append(httpResponse).append(",\n");
                        }
                        if (i == xValues.size() - 1){
                            ans.append(httpResponse).append("]");
                        }
                        logFunc("httpResponse: " + httpResponse);
                        logFunc("ans: " + ans);



                    }

                    sendSuccessResponse(String.valueOf(ans));




                } else {
                    sendSuccessResponse(String.format(
                            "{\"x\": %s, \"y\": %s, \"r\": %s, \"control\": %d, \"timeOfProcess\": %d",
                            0, 0, 0, 0, 0
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
        String send = new String().formatted();
        String response = String.format("""
                Access-Control-Allow-Origin:  http://127.0.0.1:43987
                Content-Type: application/json
                Content-Length: %d
              
                """ + body
        , body.getBytes(StandardCharsets.UTF_8).length);
        logFunc("AAAAAA " + response);
/*        System.out.println("HTTP/1.1 200 OK");
        System.out.println("Content-Type: application/html");
        System.out.println();
        System.out.println(body);*/
        System.out.println(response);
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