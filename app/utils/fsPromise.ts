import fs from 'fs';
const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export function checkFileExists(filepath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.exists(filepath, (isExists) => {
            resolve(isExists);
        });
    });
}


export function mkdirAsync(filepath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.mkdir(filepath, (nodeError) => {
            if (nodeError) {
                reject(nodeError);
            } else {
                resolve();
            }
        });
    });
}

export async function getFilesAsync(dir: string): Promise<string[]> {
    const subdirs = await readdir(dir);

    const files = await Promise.all(subdirs.map(async (subdir: string) => {
        const res = resolve(dir, subdir) as string;
        return (await stat(res)).isDirectory() ? getFilesAsync(res) : res;
    })) as string[];

    return files.reduce((a, f) => a.concat(f as any), []);
}
