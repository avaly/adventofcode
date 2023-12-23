use std::cmp::max;

use crate::{
    debug::{dbg_matrix_as_slice, dbg_matrix_as_vec},
    structs::Coordinate,
    vectors::Parser,
};

#[derive(Debug, Clone, PartialEq)]
struct Data {
    finish: Coordinate,
    map: Vec<Vec<char>>,
    max_x: usize,
    max_y: usize,
    start: Coordinate,
}

impl Data {
    fn from(contents: &str) -> Self {
        let map = contents.to_char_grid();
        let max_x = map[0].len();
        let max_y = map.len();

        let mut start = Coordinate { y: 0, x: 0 };
        let mut finish = Coordinate { y: 0, x: 0 };

        for x in 0..max_x {
            if map[0][x] == '.' {
                start.x = x;
            }
            if map[max_y - 1][x] == '.' {
                finish.x = x;
                finish.y = max_y - 1;
            }
        }

        Self {
            finish,
            map,
            max_x,
            max_y,
            start,
        }
    }

    fn solve1(&self) -> usize {
        let mut cost_raw = vec![0usize; self.max_y * self.max_x];
        let mut cost_vec: Vec<_> = cost_raw.as_mut_slice().chunks_mut(self.max_x).collect();
        let cost = cost_vec.as_mut_slice();

        let mut visited_raw = vec![0u8; self.max_y * self.max_x];
        let mut visited_vec: Vec<_> = visited_raw.as_mut_slice().chunks_mut(self.max_x).collect();
        let visited = visited_vec.as_mut_slice();

        // dbg!(self.start);
        // dbg!(self.finish);

        dbg_matrix_as_vec(&self.map);

        self.dfs(self.start, cost, visited, 0);

        dbg_matrix_as_slice(cost);
        dbg_matrix_as_slice(visited);

        cost[self.finish.y][self.finish.x]
    }

    fn dfs(
        &self,
        current: Coordinate,
        cost: &mut [&mut [usize]],
        visited: &mut [&mut [u8]],
        level: usize,
    ) {
        let prefix = "  ".repeat(level);

        println!(
            "{}current: {} ({})",
            prefix, current, cost[current.y][current.x]
        );

        visited[current.y][current.x] = 1;

        // for neighbor in current.neighbors(self.max_y, self.max_x, false) {
        // println!("{}  neighbor: {} > {}", prefix, current, neighbor);
        // }

        for neighbor in current.neighbors(self.max_y, self.max_x, false) {
            if self.map[neighbor.y][neighbor.x] == '#' || visited[neighbor.y][neighbor.x] == 1 {
                continue;
            }

            println!(
                "{}  >neighbor: {} ({}) > {}",
                prefix, current, cost[current.y][current.x], neighbor
            );

            self.dfs(neighbor, cost, visited, level + 1);

            println!(
                "{}  /neighbor: {} ({}) > {} ({})",
                prefix, current, cost[current.y][current.x], neighbor, cost[neighbor.y][neighbor.x]
            );

            dbg_matrix_as_slice(cost);
            dbg_matrix_as_slice(visited);

            println!(
                "{}cost[{}] = max(cost[{}] = {}, 1 + cost[{}] = {}) = {}",
                prefix,
                current,
                current,
                cost[current.y][current.x],
                neighbor,
                cost[neighbor.y][neighbor.x],
                max(cost[current.y][current.x], 1 + cost[neighbor.y][neighbor.x])
            );

            cost[current.y][current.x] =
                max(cost[current.y][current.x], 1 + cost[neighbor.y][neighbor.x]);
        }

        visited[current.y][current.x] = 0;
    }
}

fn part1(data: Data) -> usize {
    data.solve1()
}

fn part2(_data: Data) -> usize {
    return 0;
}

pub fn solve(contents: String) {
    let data = Data::from(contents.as_str());

    println!("Part 1: {}", part1(data.clone()));
    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    // #[case(include_str!("sample.txt"), 94)]
    #[case(include_str!("sample-2.txt"), 8)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    // #[rstest]
    // #[case(include_str!("sample.txt"), 0)]
    // fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
    //     assert_eq!(part2(Data::from(contents)), expected_value);
    // }
}
