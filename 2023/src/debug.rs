use std::fmt::Display;

pub fn dbg_matrix_as_slice<T: Display>(data: &mut [&mut [T]]) {
    let size_y = data.len();
    let size_x = data[0].len();

    print!("      ");
    for x in 0..size_x {
        print!("{: >3} ", x);
    }
    println!("");

    print!("------");
    for _ in 0..size_x {
        print!("----");
    }
    println!("");

    for y in 0..size_y {
        print!("{: >3} | ", y);
        for x in 0..size_x {
            print!("{: >3} ", data[y][x]);
        }
        println!("");
    }

    print!("------");
    for _ in 0..size_x {
        print!("----");
    }
    println!("");
}

pub fn dbg_matrix_as_vec<T: Display>(data: &Vec<Vec<T>>) {
    let size = data.get(0).unwrap().len();

    print!("      ");
    for x in 0..size {
        print!("{: >3} ", x);
    }
    println!("");

    print!("-----");
    for _ in 0..size {
        print!("----");
    }
    println!("");

    let mut y = 0;
    for line in data {
        print!("{: >3} | ", y);
        for item in line {
            print!("{: >3} ", item);
        }
        println!("");
        y += 1;
    }

    print!("-----");
    for _ in 0..size {
        print!("----");
    }
    println!("");
}
