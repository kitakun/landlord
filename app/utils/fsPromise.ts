import fs from 'fs';

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

