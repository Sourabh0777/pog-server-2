import Downloader from 'nodejs-file-downloader';

export const downloader = async (url: string) => {
  const downloader = new Downloader({
    url: url,
    directory: './downloads',
  });
  const { filePath, downloadStatus } = await downloader.download();

  return { filePath, downloadStatus };
};
