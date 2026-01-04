pub const UPDATE_RATE_HZ: f64 = 100.0;

const SECONDS_PER_DAY: u32 = 86400;

/// Simulated Julian time/date epoch tracking and propagation object
#[derive(Debug)]
pub struct Epoch {
    days: u64,
    seconds: f64,
}

impl Epoch {
    /// Create a new Epoch object with the given initial parameters
    pub fn new(days: u64, seconds: f64) -> Self {
        Self {
            days,
            seconds,
        }
    }

    /// Accessor for days (Julian) member
    pub fn get_current_days(&self) -> u64 { self.days }

    /// Accessor for seconds member
    pub fn get_current_seconds(&self) -> f64 { self.seconds }

    /// Propagate seconds of day by given step size
    /// Roll over days at correct time point
    pub fn update(&mut self, step_size_s: f64) {
        self.seconds += step_size_s;
        if self.seconds > SECONDS_PER_DAY as f64 {
            self.days += 1;
            self.seconds -= SECONDS_PER_DAY as f64;
        }
    }
}
