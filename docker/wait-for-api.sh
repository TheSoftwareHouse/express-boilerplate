endpoint="$1"
retries=250

echo -n "Waiting for api be ready on ${endpoint} endpoint"

until curl -f -v "${endpoint}" >/dev/null 2>/dev/null
do
    retries=$(($retries - 1))
    if [ $retries -eq 0 ]
    then
        echo "Failed to connect"
        exit 1
    fi

    echo -n "."
    sleep 1
done
echo

shift;

command="$@";

$command
