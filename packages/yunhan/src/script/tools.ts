import i18n from '@/locales/i18n';
import { Snackbar } from '@varlet/ui';
import { fileSave, supported } from 'browser-fs-access';

const t = i18n.global.t;

export function copyToClipboard(
  text: string,
  successCallback = () => {
    Snackbar.success(t('global.copy-success'));
  },
  errorCallback = (error: Error) => {
    Snackbar.error(t('global.copy-fail', [error.message]));
  }
) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      successCallback();
    })
    .catch((error) => {
      errorCallback(error);
    });
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 不区分大小写的string比较
export function stringEqualIgnoreCase(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase();
}

export function stringIndexOfIgnoreCase(str: string, searchStr: string) {
  return str.toLowerCase().indexOf(searchStr.toLowerCase()) != -1;
}

export const saveFile = async (fileName: string, blob: Blob, type: string) => {
  if (supported) {
    await fileSave(blob, {
      fileName,
      mimeTypes: [type]
    });
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  }
};

export const compareVersions = (v1: string, v2: string) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
};
