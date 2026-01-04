pub const UPDATE_RATE_HZ: f64 = 100.0;

const DAYS_PER_YEAR: f64 = 365.25;
const DAYS_PER_MONTH_INDEX: f64 = 30.6001;
const INTEGER_DAY_ADJUSTMNET: u32 = 1720996;
const YEAR_CENTURY_MASK: f64 = 0.01;
const CORRECTION_400_YEAR: f64 = 0.25;
const CORRECTION_4000_YEAR: f64 = 0.025;
const J2000_JULIAN_DATE: u32 = 2451545;
const CORRECTION_24_HOUR: u8 = 12;
const MINUTE_PER_HOUR: u8 = 60;
const SECOND_PER_MINUTE: u8 = 60;
const SECONDS_PER_DAY: u32 = 86400;

/// Simulated Julian time/date epoch (J2000) tracking and propagation object.
#[derive(Debug)]
pub struct Epoch {
    days: u32,
    seconds: f64,
}

impl Epoch {
    /// Create a new Epoch object with the given initial parameters.
    /// Convert calendar date/time into Julian days and seconds since J2000 epoch.
    pub fn from_calendar(year: u32, month: u8, day: u8, hour: u8, minute: u8, second: f64) -> Self {
        let julian_year = if month > 2 { year } else { year - 1 };
        let julian_month = if month > 2 { month + 1 } else { month + 13 };
        let mut julian_day = (DAYS_PER_YEAR * julian_year as f64).floor() as u32 + (DAYS_PER_MONTH_INDEX * julian_month as f64).floor() as u32 + day as u32 + INTEGER_DAY_ADJUSTMNET;
        let century = (YEAR_CENTURY_MASK * julian_year as f64).floor() as u32;
        julian_day -= century - (CORRECTION_400_YEAR * century as f64).floor() as u32 - (CORRECTION_4000_YEAR * century as f64).floor() as u32;
        Self {
            days: julian_day - J2000_JULIAN_DATE,
            seconds: (hour - CORRECTION_24_HOUR) as f64 * MINUTE_PER_HOUR as f64 * SECOND_PER_MINUTE as f64 + minute as f64 * SECOND_PER_MINUTE as f64 + second,
        }
    }

    /// Accessor for days (Julian) member.
    pub fn get_current_days(&self) -> u32 { self.days }

    /// Accessor for seconds member.
    pub fn get_current_seconds(&self) -> f64 { self.seconds }

    /// Propagate seconds of day by given step size.
    /// Roll over days at correct time point.
    pub fn update(&mut self, step_size_s: f64) {
        self.seconds += step_size_s;
        if self.seconds > SECONDS_PER_DAY as f64 {
            self.days += 1;
            self.seconds -= SECONDS_PER_DAY as f64;
        }
    }
}
