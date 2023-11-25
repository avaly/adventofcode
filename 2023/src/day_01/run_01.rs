use crate::file::{read_file_body, read_file_lines};

pub fn main(input: &str) {
    println!("Input: {input}");

    let content = read_file_body(input);

    println!("Data: {content}");

    let lines = read_file_lines(input);

    println!("Lines: {:?}", lines)
}
