import * as fs from 'fs';
import { errors } from '../../src/config/error-config';
import { createIfNotExists, readFile, deleteFile, createFile } from '../../src/lib/local';

describe('local', () => {
  describe('createIfNotExists', () => {
    it('Should create a folder if not already exists', async () => {
      const folderPath = 'tests/randomFolder';

      await createIfNotExists(folderPath);

      const exists = fs.existsSync(folderPath);
      expect(exists).toBeTruthy();
      fs.rmdirSync(folderPath);
    });

    it('Should throw an error when invalid folder was provided', async () => {
      const fsSpy = jest.spyOn(fs, 'mkdir').mockImplementationOnce((_path, cb) => cb(new Error('ErrorDuringMkDir')));

      expect.assertions(2);
      try {
        await createIfNotExists('tests/testFolder');
      } catch (error) {
        expect(fsSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual('ErrorDuringMkDir');
      }

      fsSpy.mockClear();
    });
  });

  describe('readFile', () => {
    beforeAll(() => {
      fs.writeFileSync('./randomFile.txt', 'random', 'utf8');
    });

    afterAll(() => {
      fs.unlinkSync('./randomFile.txt');
    });

    it('Should return readStream when file is found', async () => {
      const result = await readFile('./randomFile.txt');
      expect(result).not.toBeUndefined();
    });

    it('Should throw an error when file is not found', async () => {
      expect.assertions(2);
      try {
        await readFile('tests/fakeFolder/notExisting.pdf');
      } catch (error) {
        expect(error.code).toEqual(errors.FILE_READ_ERROR.code);
        expect(error.message).toEqual(errors.FILE_READ_ERROR.message);
      }
    });
  });

  describe('deleteFile', () => {
    it('Should succesfully delete file', async () => {
      fs.writeFileSync('test.txt', 'content');
      await deleteFile('test.txt');
    });

    it('Should throw an error when file is not found', async () => {
      expect.assertions(2);
      try {
        await deleteFile('tests/fakeFolder/notExisting.pdf');
      } catch (error) {
        expect(error.code).toEqual(errors.FILE_READ_ERROR.code);
        expect(error.message).toEqual(errors.FILE_READ_ERROR.message);
      }
    });
  });

  describe('createFile', () => {
    afterAll(() => {
      fs.unlinkSync('./testfile.txt');
    });

    it('Should succesfully create a file', async () => {
      await createFile('./', 'testfile.txt', 'content');

      const fileContent = fs.readFileSync('./testfile.txt', 'utf8');
      expect(fileContent).toEqual('content');
    });

    it('Should throw an error when invalid folder was provided', async () => {
      const fsSpy = jest
        .spyOn(fs, 'writeFile')
        .mockImplementationOnce((_name, _content, cb) => cb(new Error('ErrorDuringWrite')));

      expect.assertions(2);
      try {
        await createFile('./', 'testfile.txt', 'content');
      } catch (error) {
        expect(fsSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual('ErrorDuringWrite');
      }

      fsSpy.mockClear();
    });
  });
});
