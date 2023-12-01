use std::cmp::min;

use crate::file::read_file_lines;

fn part1(lines: Vec<String>) -> u32 {
    let mut result = 0;

    for line in lines {
        let chars = line.chars().filter(|x| x.is_digit(10));

        let digits: Vec<u32> = chars.map(|x| x.to_digit(10).unwrap()).collect();

        let mut value = digits[0];
        if digits.len() > 1 {
            value = value * 10 + digits[digits.len() - 1]
        } else {
            value = value * 10 + value;
        }

        result += value;
    }

    return result;
}

fn is_digit(s: &str) -> usize {
    let mut chars = s.chars();

    let first = chars.next().unwrap();
    if first.is_digit(10) {
        return 1;
    }

    match &s[0..min(3, s.len())] {
        "one" => 3,
        "two" => 3,
        "thr" => match s {
            "three" => 5,
            _ => 0,
        },
        "fou" => match &s[0..min(4, s.len())] {
            "four" => 4,
            _ => 0,
        },
        "fiv" => match &s[0..min(4, s.len())] {
            "five" => 4,
            _ => 0,
        },
        "six" => 3,
        "sev" => match s {
            "seven" => 5,
            _ => 0,
        },
        "eig" => match s {
            "eight" => 5,
            _ => 0,
        },
        "nin" => match &s[0..min(4, s.len())] {
            "nine" => 4,
            _ => 0,
        },
        _ => 0,
    }
}

fn replace_letters(s: &str) -> String {
    String::from(s)
        .replace("one", "1")
        .replace("two", "2")
        .replace("three", "3")
        .replace("four", "4")
        .replace("five", "5")
        .replace("six", "6")
        .replace("seven", "7")
        .replace("eight", "8")
        .replace("nine", "9")
}

fn first_digit(mut s: &str) -> String {
    while s.len() > 0 {
        let digit_length = is_digit(if s.len() >= 5 { &s[0..5] } else { s });

        if digit_length > 0 {
            return replace_letters(&s[0..digit_length]);
        }

        s = &s[1..s.len()];
    }

    return String::from("0");
}

fn last_digit(s: &str) -> String {
    let mut start = s.len() - 1;
    let mut end = s.len();

    loop {
        let digit_length = is_digit(&s[start..end]);
        if digit_length > 0 {
            return replace_letters(&s[start..end]);
        }

        if start == 0 {
            break;
        }
        start -= 1;
        if end - start > 5 {
            end -= 1;
        }
    }

    return String::from("0");
}

fn part2(lines: Vec<String>) -> u32 {
    let lines2: Vec<_> = lines
        .iter()
        .map(|line| {
            let first = first_digit(line.as_str());
            let last = last_digit(line.as_str());

            format!("{first}{last}")
        })
        .collect();

    return part1(lines2);
}

pub fn main(input: &str) {
    let lines = read_file_lines(input);

    println!("Part 1: {}", part1(lines.clone()));

    println!("Part 2: {}", part2(lines));
}
