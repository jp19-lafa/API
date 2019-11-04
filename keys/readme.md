## Generate Keys

`ssh-keygen -t rsa -b 4096 -m PEM -f private.key -q -N ''`
`openssl rsa -in private.key -pubout -outform PEM -out public.key`