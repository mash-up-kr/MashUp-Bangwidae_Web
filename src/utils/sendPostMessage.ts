// TODO: 공통으로 처리 예정
interface CustomWindowType extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webkit?: any;
}

// eslint-disable-next-line import/prefer-default-export
export async function sendPostMessage(
  parameters: { url: string; title: string } | { value: string },
) {
  return new Promise((_, reject) => {
    const message = {
      cmd: 'link',
      parameters,
    };

    if ('url' in parameters) {
      message.cmd = 'url';
    }

    const customWindow: CustomWindowType = window;
    try {
      customWindow.webkit?.messageHandlers.DoriDori.postMessage(message);
    } catch (e) {
      reject(e);
    }
  });
}
