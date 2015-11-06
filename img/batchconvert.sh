mkdir batch
for file in *.png ; do convert "${file}" -transparent 'white' "batch/${file}" ; done
# alternatively give the hex code #001122