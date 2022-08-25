import * as BABYLON from 'babylonjs';
import { ArcRotateCameraHammerJsInput } from './ArcRotateCameraHammerJsInput';

export class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        // Create canvas and engine
        this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    /**
     * Creates the BABYLONJS Scene
     */
    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 0.1, BABYLON.Vector3.Zero(), this._scene
        );
        this._camera.attachControl(this._canvas, true);
        const input = this._camera.inputs.attached
            .pointers as BABYLON.ArcRotateCameraPointersInput;
        input.multiTouchPanAndZoom = false;
        input.multiTouchPanning = false;

        // avoid pinch and wheel changes
        this._camera.pinchPrecision = 1000000;
        this._camera.wheelPrecision = 1000000;

        var dome = new BABYLON.PhotoDome(
            "testdome",
            "/assets/textures/sidexside.jpg",
            {
                resolution: 32,
                size: 1000
            },
            this._scene
        );

        dome.imageMode = BABYLON.PhotoDome.MODE_SIDEBYSIDE;

        this._scene
            .onPointerObservable.add((e) => {
                const event = <any>e.event;
                this._camera.fov -= event.wheelDelta * 0.0001;
                this._camera.fov = Math.max(0.1, this._camera.fov);
                this._camera.fov = Math.min(Math.PI / 2, this._camera.fov)
            }, BABYLON.PointerEventTypes.POINTERWHEEL)


        this._camera.inputs.add(new ArcRotateCameraHammerJsInput());




    }


    animate(): void {
        // run the render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
    }
}