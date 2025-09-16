public class Calculator {

    public boolean calculating(Integer x, Double y, Integer r) {
        if ((x >= 0) && (y >= 0) && ((x * x + y * y) <= r * r)){
            return true;
        }
        else if ((x <= 0) && (y >= 0) && (y <= 0.5 * x + r * 0.5)) {
            return true;
        }
        else return (x <= 0) && (y <= 0) && (x >= -r) && (y >= -r);
    }
}
