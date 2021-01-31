// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ variables
var $ = document;
var check_box_toggle = $.querySelectorAll('.check_box');
var text = $.querySelector('#text_box');
var paste = $.querySelector('.pasteText');
var clear = $.querySelector('.clearAll');
var select = $.querySelector('.selectAll');
var copy = $.querySelector('.copyAll');
var submit = $.querySelector('.submit');
var file_input = $.querySelector('.file_input');
var cover = $.querySelector('.cover');
var get_file = $.querySelector('.get_file');
var copy_output = $.querySelector('.copy_output');
var reset = $.querySelector('.reset');
var file_input_btn = $.querySelector('.file_input_btn');

// variables
var TEXT, TEXTINPUT, OUTPUT, FILENAME;

submit.addEventListener('click', () => {
    if (text.value) {
        TEXTINPUT = text.value.trim();
        TEXT = [...TEXTINPUT];  //string to arrey
        OUTPUT = '';

        // delete Enters 
        for (var i = 0; i < TEXT.length; i++) {
            var e = TEXT[i];
            if (e.charCodeAt(0) === 10) {
                TEXT.splice(i, 1);
                i = i - 1
            }
        }

        // delete all comments
        !function deleteComment() {
            var start, end;
            for (var i = 0; i < TEXT.length; i++) {
                const e = TEXT[i];

                if (e === '*' && TEXT[i - 1] === '/') {
                    start = i - 1 // set comment start index
                }
                if (e === '*' && TEXT[i + 1] === '/') {
                    end = i + 2 // set comment end index
                    TEXT.splice(start, end - start);
                    i = start - 1; //reset for new arrey
                }
            }
        }()

        // delete space
        !function deleteSpace() {
            let del = false;
            let on = true;

            for (var i = 0; i < TEXT.length; i++) {
                const e = TEXT[i];

                if (e === ' ') { del = true }
                if (e === '{') { del = true; on = true }
                if (e === ';') { on = true; del = true }
                if (e === ':') { on = false; del = false }
                if (e === '}') { del = false; on = false }
                if (e === '@') { del = false; on = false }

                if (e === ':' && TEXT[i + 1] === ' ') { TEXT.splice(i + 1, 1); i = i - 2 }
                if (e === '{' && TEXT[i - 1] === ' ') { TEXT.splice(i - 1, 1); i = i - 3 }
                if (e === '}' && TEXT[i + 1] === ' ') { TEXT.splice(i + 1, 1); i = i - 2 }

                if (del && on && e === ' ') {
                    TEXT.splice(i, 1); // cut arrey
                    del = false;
                    i = i - 2
                }
            }
        }()

        // delete end Sammy Cullens
        !function delEndSammyCullen() {
            TEXT.forEach((e, i) => {
                if (e === ';' && TEXT[i + 1] === '}') {
                    TEXT.splice(i, 1);
                }
            })
        }()

        TEXT.forEach(e => OUTPUT += e) // arrey to string
        text.value = OUTPUT;

        cover.className = 'cover output';
    }
})

// read input file
file_input.addEventListener("change", changeFileInput);
function changeFileInput() {
    if (file_input.files && file_input.files[0]) {
        let read = new FileReader();
        FILENAME = file_input.files[0].name;
        file_input_btn.innerText = FILENAME;
        read.readAsBinaryString(file_input.files[0]);
        read.addEventListener('load', (e) => text.value = e.target.result);
    }
}

// drag and set input file
document.documentElement.addEventListener('dragover', (e) => e.preventDefault())
document.documentElement.addEventListener('drop', (e) => {
    e.preventDefault();
    file_input.files = e.dataTransfer.files;
    changeFileInput()
})

//seve file css
get_file.addEventListener('click', () => {
    let blob = new Blob([OUTPUT], { type: 'text/plain' });
    let el = document.createElement("a");
    el.download = FILENAME ?? 'OUTPUT.css'; // file name
    window.URL = window.URL || window.webkitURL;
    el.href = window.URL.createObjectURL(blob);
    document.body.appendChild(el);
    el.addEventListener('click', e => document.body.removeChild(e.target)) //remove element
    el.click();
})

// reset page
reset.addEventListener('click', resetPage)
function resetPage() {
    cover.classList.remove('output');
    text.value = '';
    file_input.value = '';
    file_input_btn.innerText = 'فایل را انتخاب کنید'
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ctrl btn
select.addEventListener('click', () => text.select())
clear.addEventListener('click', () => file_input.value = text.value='')
copy_output.onclick = copy.onclick = () => {
    text.select();
    document.execCommand("copy")
    window.getSelection().removeAllRanges();
}
paste.addEventListener('click', () => {
    text.focus();
    document.execCommand("paste")
    navigator.clipboard.readText().then(clipboard => text.value = clipboard);
})













