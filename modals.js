const helpModal = (screen, blessed) => {
  const helpMenuData = [
    ['Keybinding', 'Action'],
    ['-----------', '-----------'],
    ['Enter', 'Displays function data when focused on Functions table'],
    ['o', 'Opens the AWS console for a selected lambda function'],
    ['q', 'Close the application'],
    ['d', 'Deploys the selected lambda function'],
    ['s', 'Deploys all the lambda functions within the stack'],
    ['Arrows', 'Used to select from list, by default the function list'],
    ['Tab', 'Used to switch focus between lambda functions and event buses'],
    ['i', 'Open an event injection window for the selected event bus']
  ];
  const cliOptionsData = [
    ['---------', '----------'],
    ['CLI Option', 'Description'],
    ['---------', '----------'],
    ['-V, --version', 'output the version number'],
    ['-n, --stack-name <stackName>', 'AWS stack name'],
    ['-r, --region <region>', 'AWS region'],
    ['-t, --start-time <startTime>', 'when to start from'],
    ['-i, --interval <interval>', 'interval of graphs, in seconds'],
    ['-p, --profile <profile>', 'aws profile name to use'],
    ['-h, --help', 'output usage information'],
  ];
  const helpLayout = blessed.layout({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 112,
    height: 27,
    border: 'line',
    style: { border: { fg: 'green' } },
    keys: true,
  });
  blessed.listtable({
    parent: helpLayout,
    interactive: false,
    top: 'center',
    left: 'center',
    data: [...helpMenuData, ...cliOptionsData],
    border: 'line',
    pad: 2,
    width: 110,
    height: 20,
    style: {
      border: { fg: 'green' },
      header: { fg: 'bright-green', bold: true, underline: true },
      cell: { fg: 'yellow' },
    },
  });
  blessed.box({
    parent: helpLayout,
    width: 110,
    height: 4,
    left: 'right',
    top: 'center',
    align: 'center',
    padding: { left: 2, right: 2 },
    border: 'line',
    style: { fg: 'green', border: { fg: 'green' } },
    content: 'Please give feedback via GitHub Issues \n ESC to close',
  });
  helpLayout.focus();
  helpLayout.key(['escape'], () => {
    helpLayout.destroy();
  });
};

const eventTemplate = (busName) => `
{
  "id": "53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa",
  "bus": ${busName},
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "account": "123456789012",
  "time": "2015-10-08T16:53:06Z",
  "region": "us-east-1",
  "resources": [ "arn:aws:events:us-east-1:123456789012:rule/MyScheduledRule" ],
  "detail": {}
}`;

const eventInjectionModal = (screen, blessed, eventBridge) => {
  const eventInjectLayout = blessed.layout({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 112,
    height: 27,
    border: 'line',
    style: { border: { fg: 'green' } },
    keys: true,
    grabKeys: true,
  });
  const textarea = blessed.textarea({
    parent: eventInjectLayout,
    top: 'center',
    left: 'center',
    border: 'line',
    pad: 2,
    value: eventTemplate(eventBridge),
    width: 110,
    height: 20,
    keys: true,
    style: {
      border: { fg: 'green' },
      header: { fg: 'bright-green', bold: true, underline: true },
      cell: { fg: 'yellow' },
    },
  });
  blessed.box({
    parent: eventInjectLayout,
    width: 110,
    height: 4,
    left: 'right',
    top: 'center',
    align: 'center',
    padding: { left: 2, right: 2 },
    border: 'line',
    style: { fg: 'green', border: { fg: 'green' } },
    content: 'e to enter editor | ESC to unfocus editor \n z to deploy event | x to discard and close',
  });

  const closeModal = () => {
    eventInjectLayout.destroy();
  };

  eventInjectLayout.focus();

  eventInjectLayout.key(['e'], () => {
    textarea.readEditor();
  });

  eventInjectLayout.key(['z'], () => {
    // Inject event textarea.getValue()
    closeModal();
  });

  eventInjectLayout.key(['x'], () => {
    // Discard modal
    closeModal();
  });
};

module.exports = {
  helpModal,
  eventInjectionModal,
};
