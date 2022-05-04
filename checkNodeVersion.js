const result = process.versions;

if (result && result.node) {
  if (parseInt(result.node, 10) >= 12 && parseInt(result.node, 10) < 15) {
    console.log(
      `-------******* Good to Go with your Node Version: ${result.node} *******-------`,
    );
  } else {
    console.log(
      '-------******* Package installation(npm install) or Project startup command(npm start) failed due to Node Version, Please install and use Node Version >=12 *******-------',
    );
    console.log(
      `-------******* Your current Node Version is: ${result.node} *******-------`,
    );
    process.exit(1);
  }
} else {
  console.log(
    '-------******* Something went wrong while checking Node version *******-------',
  );
  process.exit(1);
}
