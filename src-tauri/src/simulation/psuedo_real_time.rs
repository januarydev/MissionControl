/// Basic pseudo-real-time source clock with configurable base rate
#[derive(Debug)]
pub struct PseudoRealTime {
    elapsed_ticks: u64,
    tick_period: std::time::Duration,
    elapsed_time_ms: f64,
    next_tick_time: std::time::Instant,
    sleeper: spin_sleep::SpinSleeper,
}

impl PseudoRealTime {
    /// Create a new PseudoRealTime object with desired base rate
    pub fn new(base_rate_hz: f64) -> Self {
        Self {
            elapsed_ticks: 0,
            tick_period: std::time::Duration::from_secs_f64(1.0 / base_rate_hz),
            elapsed_time_ms: 0.0,
            next_tick_time: std::time::Instant::now(),
            sleeper: spin_sleep::SpinSleeper::default(),
        }
    }

    /// Accessor for base tick period in seconds
    pub fn get_tick_period_s(&self) -> f64 { self.tick_period.as_secs_f64() }

    /// Accessor for simulation elapsed time in milliseconds
    pub fn get_elapsed_time_ms(&self) -> f64 { self.elapsed_time_ms }

    /// Determine if task should be run on current cycle for configured execution rate
    /// Rounds to nearest tick, so will "alias" a rate to the closest even division of the base rate
    pub fn check_run_tick(&self, rate_hz: f64) -> bool {
        let ticks_per_cycle = (1.0 / rate_hz / self.tick_period.as_secs_f64()).round() as u64;
        self.elapsed_ticks % ticks_per_cycle == 0
    }

    /// Calculate when the next real-time tick should take place and sleep till that instant
    /// Allows for adjustment of simulation to sleep longer or shorter if falling behind or getting ahead
    /// Shouldn't drift from wallclock time over long period, but ticks themselves may adjust back or forth
    ///     so that makes the simulation pseudo-real-time rather than real-time
    pub fn wait_for_sync(&mut self) {
        self.next_tick_time += self.tick_period;
        self.sleeper.sleep_s((self.next_tick_time - std::time::Instant::now()).as_secs_f64());
        self.elapsed_ticks += 1;
        self.elapsed_time_ms += self.tick_period.as_millis() as f64;
    }
}
