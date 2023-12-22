use crate::structs::Coordinate3D;

// const MAX_XY: usize = 10;
// const MAX_Z: usize = 10;

#[derive(Debug, Clone, PartialEq)]
struct Brick {
    points: Vec<Coordinate3D>,
}

impl Brick {
    fn from(contents: &str) -> Self {
        let parts = contents.split("~").collect::<Vec<_>>();

        let start = parts[0]
            .split(",")
            .into_iter()
            .map(|item| item.parse().unwrap())
            .collect::<Vec<_>>();

        let stop = parts[1]
            .split(",")
            .into_iter()
            .map(|item| item.parse::<usize>().unwrap())
            .collect::<Vec<_>>();

        let mut points = vec![];

        for z in start[2]..=stop[2] {
            for y in start[1]..=stop[1] {
                for x in start[0]..=stop[0] {
                    points.push(Coordinate3D { x, y, z });
                }
            }
        }

        Self { points }
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    bricks: Vec<Brick>,
}

impl Data {
    fn from(contents: &str) -> Self {
        Self {
            bricks: contents.lines().map(Brick::from).collect(),
        }
    }
}

fn can_move(brick: &Brick, bricks: &mut [Brick]) -> bool {
    dbg!(&brick);
    dbg!(&bricks);
    // if brick.z == 1 {
    //     return false;
    // }

    false
}

fn part1(contents: String) -> usize {
    let mut data = Data::from(contents.as_str());

    let bricks = data.bricks.as_mut_slice();
    let bricks_count = bricks.len();

    for index in 0..bricks_count {
        let mut brick = bricks[index];
        while can_move(&brick, bricks) {
            // brick.start.z -= 1;
        }
        break;
    }

    0
}

fn part2(contents: String) -> usize {
    return 0;
}

pub fn solve(contents: String) {
    println!("Part 1: {}", part1(contents.clone()));
    println!("Part 2: {}", part2(contents));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(include_str!("sample.txt"), 5)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(String::from(contents)), expected_value);
    }

    // #[rstest]
    // #[case(include_str!("sample.txt"), 0)]
    // fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
    //     assert_eq!(part2(Data::from(contents)), expected_value);
    // }
}
