import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    static Response response = new Response();


    public static void main(String[] args) throws IOException {
        response.logFunc("Server started");
        var fcgiInterface = new FCGIInterface();


        while (fcgiInterface.FCGIaccept() >= 0) {
            var method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");
            response.logFunc("Method: " + method);

            if (method.equals("POST")) {
                // Чтение тела POST запроса
                String postData = readPostData();
                response.logFunc("POST data: " + postData);
                response.logFunc("23");

                response.answer(postData, method);
            } else {
                response.logFunc("Method Not Allowed");
            }
        }

    }


    private static String readPostData() throws IOException {
        InputStream inputStream = FCGIInterface.request.inStream;
        int contentLength = Integer.parseInt(
                FCGIInterface.request.params.getProperty("CONTENT_LENGTH", "0")
        );

        if (contentLength > 0) {
            byte[] buffer = new byte[contentLength];
            int bytesRead = inputStream.read(buffer);
            if (bytesRead > 0) {
                return new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);
            }
        }
        return ""; // ПОсмотри сюда!!!!!!!
    }
        //System.out.println("11");
}