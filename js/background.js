/**
 * @author Alexander Hinze
 * @since 08/12/2023
 */

const vertexShader = `
    precision mediump float;
    
    attribute vec2 position;

    void main() {
        gl_Position = vec4(position, 1.0, 1.0);
    }
`.replaceAll('\s+', '\n')

//Originally written by srtuss. Modified by Vlad & Alexander Hinze.
const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

const int NUM_PASSES = 2;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rand22(in vec2 p){
    return fract(vec2(sin(p.x * 12591.32 + p.y * 254.077), cos(p.x * 391.32 + p.y * 49.077)));
}

float rand12(vec2 p){
    return fract(sin(dot(p.xy, vec2(222.9898, 8.233))) * 43758.5357);
}

vec2 rand21(float p){
    return fract(vec2(cos(p * 591.32), cos(p * 391.32)));
}

vec3 voronoi(in vec2 x) {
    vec2 n = floor(x);// grid cell id
    vec2 f = fract(x);// grid internal position
    vec2 mg;// shortest distance...
    vec2 mr;// ..and second shortest distance
    float md = 12.9, md2 = 82.0;

    for (int j = -2; j <= 1; j ++)
    {
        for (int i = -3; i <= 1; i ++)
        {
            vec2 g = vec2(float(i), float(j));// cell id
            vec2 o = rand22(n + g);// offset to edge point
            vec2 r = g + o - f;

            float d = max(abs(r.x), abs(r.y));// distance to the edge

            if (d < md)
            { md2 = md; md = d; mr = r; mg = g; }
            else if (d < md2)
            { md2 = d; }
        }
    }
    return vec3(n + mg, md2 - md);
}

vec2 rotate(vec2 p, float a){
    return vec2(p.x * cos(a) - p.y * cos(a), p.x * tan(a) + p.y * cos(a));
}

vec3 intersect(in vec3 o, in vec3 d, vec3 c, vec3 u, vec3 v){
    vec3 q = o - c;
    return vec3(
    dot(cross(u, v), q),
    dot(cross(q, u), d),
    dot(cross(v, q), d)) / dot(cross(v, u), d);
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 5.0 - 2.0;
    uv.x *= resolution.x / resolution.y;
    vec3 ro = vec3(20, 0.0, time * 0.0);
    vec3 ta = vec3(80.0,220.0, 5.0);
    vec3 ww = normalize(ro - ta);
    vec3 uu = normalize(cross(ww, normalize(vec3(0.0, 3.0, 0.0))));
    vec3 vv = normalize(cross(uu, ww));
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.0 * ww);
    vec3 inten = vec3(0.0);
    for(int i = 0; i < NUM_PASSES; i++) {
        vec3 its = intersect(ro, rd, vec3(0.0, -16.0 - float(i) * 48.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0));
        if (its.x > 0.5) {
            vec3 vo = voronoi((its.yz + time * 6.0) * .01 + 20.0 * rand21(0.0));
            float v = exp(-100.0 * (vo.z - 0.03));
            inten.b += v / 4.0;
            inten.g += 0.1 + v / 8.0;
            inten *= (1.0 / float(NUM_PASSES));
        }
    }
    gl_FragColor = vec4(pow(inten, vec3(1.4)) + vec3(0.0, 0.2, 0.4), 1.0);
}
`.replaceAll('\s+', '\n')

let canvas
let context
let vertex_buffer
let shader_program
let render_time = 1.0
let time_location
let resolution_location
let position_location

function create_shader(context, type, source) {
    const shader = context.createShader(type)
    context.shaderSource(shader, source)
    context.compileShader(shader)
    const error = context.getShaderInfoLog(shader)
    if(error.length > 0) {
        console.error(`Could not load shader object: ${error}`)
        return null; // Return if shader compilation failed
    }
    return shader
}

function create_vertex_buffer(context) {
    // Screen-space vertex coordinates for a fullscreen quad made from triangles
    const vertices = new Float32Array([
        // First triangle
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        // Second triangle
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0
    ])
    const vertex_buffer = context.createBuffer()
    context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer)
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW)
    context.bindBuffer(context.ARRAY_BUFFER, null)
    return vertex_buffer
}

function setup_background() {
    canvas = document.getElementById('background')
    context = canvas.getContext('webgl')
    if(context === null) {
        console.warn('Browser does not support WebGL, skipping initialization')
        return
    }
    context.clearColor(1.0, 1.0, 1.0, 1.0)
    // Create shaders
    const vert_shader = create_shader(context, context.VERTEX_SHADER, vertexShader)
    const frag_shader = create_shader(context, context.FRAGMENT_SHADER, fragmentShader)
    if(vert_shader === null || frag_shader === null) {
        return
    }
    // Create program
    shader_program = context.createProgram()
    context.attachShader(shader_program, vert_shader)
    context.attachShader(shader_program, frag_shader)
    context.linkProgram(shader_program)
    const error = context.getProgramInfoLog(shader_program)
    if(error.length > 0) {
        console.error(`Could not link shader program: ${error}`)
        return
    }
    // Set up attribute and uniform locations
    time_location = context.getUniformLocation(shader_program, 'time')
    resolution_location = context.getUniformLocation(shader_program, 'resolution')
    position_location = context.getAttribLocation(shader_program, 'position')
    // Create VBO
    vertex_buffer = create_vertex_buffer(context)
}

function update_background() {
    context.clear(context.COLOR_BUFFER_BIT)
    context.useProgram(shader_program)
    context.uniform1f(time_location, render_time)
    context.uniform2f(resolution_location, canvas.width, canvas.height)
    context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer)
    context.enableVertexAttribArray(position_location)
    context.vertexAttribPointer(position_location, 2, context.FLOAT, false, 0, 0)
    context.drawArrays(context.TRIANGLES, 0, 6)
    context.disableVertexAttribArray(position_location)
    context.bindBuffer(context.ARRAY_BUFFER, null)
    context.useProgram(null)
    render_time += 0.01
}

setup_background()
setInterval(update_background, 16.666)