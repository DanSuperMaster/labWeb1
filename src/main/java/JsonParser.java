import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JsonParser {

    public List<String> parseX(String jsonString) {

        Gson gson = new Gson();
        Type type = new TypeToken<Map<String, Object>>(){}.getType();
        Map<String, Object> data = gson.fromJson(jsonString, type);

        // Получаем массив x
        List<String> xArray = (List<String>) data.get("x");
        return xArray;

    }

    public String parseY(String jsonString) {
        Gson gson = new Gson();
        Type type = new TypeToken<Map<String, Object>>(){}.getType();
        Map<String, Object> data = gson.fromJson(jsonString, type);
        return (String) data.get("y");
    }

    public String parseR(String jsonString) {
        Gson gson = new Gson();
        Type type = new TypeToken<Map<String, Object>>(){}.getType();
        Map<String, Object> data = gson.fromJson(jsonString, type);
        return (String) data.get("r");
    }
}