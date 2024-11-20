package hi.is.tasker.controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FallbackController {

    @GetMapping("/{path:[^.]*}")
    public String redirect() {
        // Return the name of the index.html file
        return "forward:/index.html";
    }
}
