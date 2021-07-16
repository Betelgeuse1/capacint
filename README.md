# capacint
A conversion tool to transform images into colored svgs. It uses ppmcolormask, potrace and mkbitmap. 
I hope it has decent enough results. Frontend uses hyperapp just for training.

### Whatta do next ?
- [X] Write the merge svgs function
- [ ] Write the color detection function
- [ ] Transform all the color's ppm into svgs and merge them using the merging func
- [X] Upgrade the UI drastically 
- [ ] Check for all safety issues that might be happening inside the app
- [ ] Write the cron job that clean the svgs folder
- [ ] Deploy to Vultr
- [ ] Rewrite the conversion tool in a compiled language (RUST, C, Go) ?
