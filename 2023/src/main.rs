use crate::day_01::run_01;
use crate::guess::sample;
use std::env;

pub mod day_01;
pub mod guess;

fn help() {
    println!("Usage: aoc PROGRAM")
}

fn main() {
    let args: Vec<String> = env::args().collect();

    match args.len() {
        1 => help(),
        2 => {
            let program = &args[1];

            match program.as_str() {
                "01" => run_01::run(),
                "guess" => sample::sample_run(),
                _ => help(),
            }
        }
        _ => help(),
    }
}
