pub fn dbg_matrix(data: &Vec<Vec<u32>>) {
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
