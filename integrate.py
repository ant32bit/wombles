import os
import sys
import shutil
from hashlib import md5

def get_file_hash(filename):
    with open(filename, 'rb') as fh:
        c = fh.read()
        return md5(c).hexdigest()

def get_extension(filename):
    _, ext = os.path.splitext(filename)
    return ext

def make_root_files(env):
    env = os.path.dirname(env + '/') + '/'
    root_template = 'root-template/'
    www_root = env + 'www-root/'

    bundles = ['main.css', 'console.js', 'internal.js']
    html_files = ['index.html', 'internal.html']

    if os.path.exists(www_root):
        print('clearing root files')
        shutil.rmtree(www_root)

    os.makedirs(www_root)

    other_files = { }

    for bundle in bundles:
        loc = env + bundle
        ext = os.path.splitext(bundle)[1]
        new_file = get_file_hash(loc) + ext
        print(f'copying {bundle} as {new_file}')
        shutil.copyfile(loc, www_root + new_file)
        other_files[bundle] = new_file

    for file in os.listdir(root_template):
        if file not in html_files:
            new_file = get_file_hash(root_template + file) + get_extension(file)
            print(f'copying {file} as {new_file}')
            shutil.copyfile(root_template + file, www_root + new_file)
            other_files[file] = new_file

    for html_file in html_files:
        with open(root_template + html_file) as fh:
            index_html_content = fh.read()

        for file in other_files.keys():
            index_html_content = index_html_content.replace('{{' + file + '}}', other_files[file])

        with open(www_root + html_file, 'w') as fh:
            print(f'writing {html_file}')
            fh.write(index_html_content)

if __name__ == "__main__":
    print('\n')
    make_root_files('dist/')
    print('\n')
