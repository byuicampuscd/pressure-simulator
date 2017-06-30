let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/code/projects/js/function-plot
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +23 lib/index.js
badd +22 site/scale.html
badd +380 README.md
badd +135 lib/tip.js
badd +116 site/js/index.js
badd +47 lib/graph-types/interval.js
badd +77 lib/graph-types/polyline.js
badd +30 lib/graph-types/scatter.js
badd +46 ~/.config/nvim/plugged/vim-fugitive/doc/fugitive.txt
badd +1 site.js
badd +1 index.js
badd +17 site/js/playground.js
badd +59 site/playground.html
badd +92 node_modules/interval-arithmetic/lib/operations/algebra.js
badd +1 node_modules/interval-arithmetic/lib/round-math.js
badd +38 lib/samplers/interval.js
badd +4 package.json
badd +1 ~/code/learn/opengl/learnopengl.com-glitter/Glitter/Sources/main.cpp
badd +15 ~/code/learn/opengl/learnopengl.com-glitter/Glitter/Headers/glitter.hpp
badd +148 site/index.html
badd +2 site/partials/wzrd.html
badd +21 lib/helpers/eval.js
badd +7515 site/js/vendor/d3.js
badd +14 lib/utils.js
badd +1 lib/graph-types/index.js
badd +1 lib/samplers/index.js
badd +78 lib/samplers/builtIn.js
badd +7 node_modules/clamp/index.js
badd +18 CHANGELOG.md
badd +1 site/js/function-plot.js
badd +1 site/LICENSE.txt
badd +31 lib/helpers/derivative.js
badd +9 lib/helpers/secant.js
badd +46 lib/evaluate.js
argglobal
silent! argdel *
edit lib/helpers/derivative.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd t
set winheight=1 winwidth=1
exe '1resize ' . ((&lines * 34 + 36) / 73)
exe 'vert 1resize ' . ((&columns * 86 + 86) / 173)
exe '2resize ' . ((&lines * 35 + 36) / 73)
exe 'vert 2resize ' . ((&columns * 86 + 86) / 173)
exe '3resize ' . ((&lines * 34 + 36) / 73)
exe 'vert 3resize ' . ((&columns * 86 + 86) / 173)
exe '4resize ' . ((&lines * 35 + 36) / 73)
exe 'vert 4resize ' . ((&columns * 86 + 86) / 173)
argglobal
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 16 - ((15 * winheight(0) + 17) / 34)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
16
normal! 025|
lcd ~/code/projects/js/function-plot
wincmd w
argglobal
edit ~/code/projects/js/function-plot/site/playground.html
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 58 - ((13 * winheight(0) + 17) / 35)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
58
normal! 042|
lcd ~/code/projects/js/function-plot
wincmd w
argglobal
edit ~/code/projects/js/function-plot/package.json
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 70 - ((16 * winheight(0) + 17) / 34)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
70
normal! 022|
lcd ~/code/projects/js/function-plot
wincmd w
argglobal
edit ~/code/projects/js/function-plot/README.md
setlocal fdm=marker
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=2
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 366 - ((19 * winheight(0) + 17) / 35)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
366
normal! 05|
lcd ~/code/projects/js/function-plot
wincmd w
3wincmd w
exe '1resize ' . ((&lines * 34 + 36) / 73)
exe 'vert 1resize ' . ((&columns * 86 + 86) / 173)
exe '2resize ' . ((&lines * 35 + 36) / 73)
exe 'vert 2resize ' . ((&columns * 86 + 86) / 173)
exe '3resize ' . ((&lines * 34 + 36) / 73)
exe 'vert 3resize ' . ((&columns * 86 + 86) / 173)
exe '4resize ' . ((&lines * 35 + 36) / 73)
exe 'vert 4resize ' . ((&columns * 86 + 86) / 173)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOc
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
let g:this_obsession_status = 2
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
