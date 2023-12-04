use std::env;

pub mod day_01;
pub mod day_02;
pub mod day_03;
pub mod day_04;
pub mod day_05;
pub mod day_06;
// pub mod day_07;
// pub mod day_08;
// pub mod day_09;
// pub mod day_10;
// pub mod day_11;
// pub mod day_12;
// pub mod day_13;
// pub mod day_14;
// pub mod day_15;
// pub mod day_16;
// pub mod day_17;
// pub mod day_18;
// pub mod day_19;
// pub mod day_20;
// pub mod day_21;
// pub mod day_22;
// pub mod day_23;
// pub mod day_24;
// pub mod day_25;
pub mod file;
pub mod matrix;
pub mod structs;

fn help() {
    println!("Usage: aoc PROGRAM")
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() == 3 {
        let program = &args[1];
        let input = &args[2];

        match program.as_str() {
            "01" => crate::day_01::run_01::main(input),
            "02" => crate::day_02::run_02::main(input),
            "03" => crate::day_03::run_03::main(input),
            "04" => crate::day_04::run_04::main(input),
            "05" => crate::day_05::run_05::main(input),
            "06" => crate::day_06::run_06::main(input),
            // "07" => crate::day_07::run_07::main(input),
            // "08" => crate::day_08::run_08::main(input),
            // "09" => crate::day_09::run_09::main(input),
            // "10" => crate::day_10::run_10::main(input),
            // "11" => crate::day_11::run_11::main(input),
            // "12" => crate::day_12::run_12::main(input),
            // "13" => crate::day_13::run_13::main(input),
            // "14" => crate::day_14::run_14::main(input),
            // "15" => crate::day_15::run_15::main(input),
            // "16" => crate::day_16::run_16::main(input),
            // "17" => crate::day_17::run_17::main(input),
            // "18" => crate::day_18::run_18::main(input),
            // "19" => crate::day_19::run_19::main(input),
            // "20" => crate::day_20::run_20::main(input),
            // "21" => crate::day_21::run_21::main(input),
            // "22" => crate::day_22::run_22::main(input),
            // "23" => crate::day_23::run_23::main(input),
            // "24" => crate::day_24::run_24::main(input),
            // "25" => crate::day_25::run_25::main(input),
            _ => help(),
        }
    } else {
        help()
    }
}
