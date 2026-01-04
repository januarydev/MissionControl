pub const UPDATE_RATE_HZ: f64 = 100.0;

const SECONDS_PER_DAY: u32 = 86400;

#[derive(Debug)]
pub struct Epoch {
    days: u64,
    seconds: f64,
}

impl Epoch {
    pub fn new(days: u64, seconds: f64) -> Self {
        Self {
            days,
            seconds,
        }
    }

    pub fn get_current_days(&self) -> u64 { self.days }

    pub fn get_current_seconds(&self) -> f64 { self.seconds }

    pub fn update(&mut self, step_size_s: f64) {
        self.seconds += step_size_s;
        if self.seconds > SECONDS_PER_DAY as f64 {
            self.days += 1;
            self.seconds -= SECONDS_PER_DAY as f64;
        }
    }
}
