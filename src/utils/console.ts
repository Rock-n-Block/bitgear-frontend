const styles = {
  App: 'color: black; font-weight: bold;',
  PageMarketsContent: 'color: #065a66; font-weight: bold;',
  CoinMarketCapService: 'color: grey; font-weight: bold;',
  ModalContentQuotes: 'color: #996655; font-weight: bold;',
};

export const stylizeConsole = ({ showConsoleLog = true }) => {
  const stylesOfPages = Object.entries(styles);
  const { log } = console;
  console.log = (...args: any) => {
    if (!showConsoleLog) return;
    let used = false;
    stylesOfPages.map((item) => {
      const [page, style] = item;
      if (args[0].includes(page)) {
        log(`%c%s`, style, ...args);
        used = true;
      }
      return null;
    });
    if (!used) log(...args);
  };
};
