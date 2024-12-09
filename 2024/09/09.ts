type Block = {
	id: number;
	index: number;
	size: number;
};
type Disk = Block[];

function parse(input: string[]): Disk {
	const disk: Block[] = [];

	const blocks = input[0].split('').map(Number);
	let fileID = 0;
	let isFile = true;
	let index = 0;

	for (const size of blocks) {
		if (isFile) {
			disk.push({ id: fileID, index, size });
			fileID++;
		} else if (size > 0) {
			disk.push({ id: -1, index, size });
		}
		isFile = !isFile;
		index += size;
	}

	return disk;
}

function mergeSpaces(disk: Disk, index: number): void {
	if (index >= disk.length || disk[index].id !== -1) {
		return;
	}

	let activeIndex = index;

	if (activeIndex > 0 && disk[activeIndex - 1].id === -1) {
		disk[activeIndex - 1].size += disk[activeIndex].size;
		disk.splice(activeIndex, 1);
		activeIndex--;
	}

	if (activeIndex < disk.length - 1 && disk[activeIndex + 1].id === -1) {
		disk[activeIndex].size += disk[activeIndex + 1].size;
		disk.splice(activeIndex + 1, 1);
	}
}

function rearrange(disk: Disk, fullBlocks: boolean): void {
	let fileID = 0;

	// find max file ID
	for (const block of disk) {
		if (block.id !== -1 && block.id > fileID) {
			fileID = block.id;
		}
	}

	while (fileID > 0) {
		let fileIndex = disk.length - 1;

		while (fileIndex > 0 && disk[fileIndex].id !== fileID) {
			fileIndex--;
		}

		const file = { ...disk[fileIndex] };

		let spaceIndex = 0;
		while (
			spaceIndex < fileIndex &&
			(disk[spaceIndex].id !== -1 || (fullBlocks && disk[spaceIndex].size < file.size))
		) {
			spaceIndex++;
		}

		if (
			spaceIndex < fileIndex &&
			disk[spaceIndex].id === -1 &&
			(!fullBlocks || disk[spaceIndex].size >= file.size)
		) {
			const space = { ...disk[spaceIndex] };

			disk[spaceIndex] = {
				...file,
				index: space.index,
				size: Math.min(space.size, file.size),
			};

			if (space.size >= file.size) {
				disk[fileIndex].id = -1;
				mergeSpaces(disk, fileIndex);
				fileID--;
			} else {
				disk[fileIndex].size = file.size - space.size;
				mergeSpaces(disk, fileIndex + 1);
			}

			if (space.size > file.size) {
				disk.splice(spaceIndex + 1, 0, {
					id: -1,
					index: space.index + file.size,
					size: space.size - file.size,
				});
				mergeSpaces(disk, spaceIndex + 1);
			}
		} else {
			if (fullBlocks) {
				fileID--;
			} else {
				break;
			}
		}
	}
}

function checksum(disk: Disk): number {
	return disk.reduce((acc, block) => {
		if (block.id === -1) {
			return acc;
		}
		let value = 0;
		for (let i = 0; i < block.size; i++) {
			value += block.id * (block.index + i);
		}
		return acc + value;
	}, 0);
}

export function part1(input: string[]): number {
	const disk = parse(input);

	rearrange(disk, false);

	return checksum(disk);
}

export function part2(input: string[]): number {
	const disk = parse(input);

	rearrange(disk, true);

	return checksum(disk);
}
