use std::{
    fs::File,
    io::{BufRead, BufReader, Read},
};

pub fn read_file_body(input: &str) -> String {
    let mut content = String::new();

    let mut file = File::open(input).expect("missing file {input}");

    file.read_to_string(&mut content).expect("missing body");

    return content;
}

pub fn read_file_lines(input: &str) -> Vec<String> {
    let file = File::open(input).expect("missing file {input}");

    let buf = BufReader::new(file);

    buf.lines()
        .map(|l| l.expect("Could not parse line"))
        .collect()
}

pub fn read_file_bytes(input: &str) -> Vec<u8> {
    let mut content = vec![];
    let mut file = File::open(input).expect("missing file {input}");

    file.read_to_end(&mut content).expect("missing body");

    return content;
}
