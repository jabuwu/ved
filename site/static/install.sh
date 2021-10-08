which deno > /dev/null
if [ ! "$?" = "0" ]; then
  echo "Deno must be installed to install ved"
  exit 1
fi

echo Installing ved...
deno run -A --unstable --reload -q @ORIGIN@/cli.ts :upgrade --local --host @ORIGIN@