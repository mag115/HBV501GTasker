package hi.is.tasker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class ReportOptions {
    private boolean includeTasks;
    private boolean includeTimeSpent;
    private boolean includePerformance;

    // Getters and Setters
    public boolean isIncludeTasks() { return includeTasks; }
    public void setIncludeTasks(boolean includeTasks) { this.includeTasks = includeTasks; }

    public boolean isIncludeTimeSpent() { return includeTimeSpent; }
    public void setIncludeTimeSpent(boolean includeTimeSpent) { this.includeTimeSpent = includeTimeSpent; }

    public boolean isIncludePerformance() { return includePerformance; }
    public void setIncludePerformance(boolean includePerformance) { this.includePerformance = includePerformance; }
}

