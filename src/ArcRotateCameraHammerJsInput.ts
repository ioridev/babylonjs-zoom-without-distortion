
import { ArcRotateCamera, ICameraInput, Tools, } from "babylonjs";

import * as Hammer from 'hammerjs'

export class ArcRotateCameraHammerJsInput implements ICameraInput<ArcRotateCamera> {

    public camera!: ArcRotateCamera

    constructor(
        public zoomSensitivity = 0.5,

        public useInertialPanning = false
    ) { }

    public attachControl(noPreventDefault?: boolean): void {
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments)
        const engine = this.camera.getEngine()
        const element = <EventTarget>engine.getInputElement()
        const manager = new Hammer.Manager(element)
        const Pan = new Hammer.Pan() // { threshold: 20 }
        const Rotate = new Hammer.Rotate()
        const Pinch = new Hammer.Pinch()

        Pinch.recognizeWith([Rotate])

        manager.add(Pan)
        manager.add(Rotate)
        manager.add(Pinch)

        manager.on('pinch', e => {
            this.camera.fov = Math.max(this.camera.fov, 0.8);
            this.camera.fov = Math.min(this.camera.fov, 1.8);
            const fovDelta = e.scale < 1 ? (- this.zoomSensitivity) : this.zoomSensitivity
            this.camera.fov -= fovDelta * 0.05;
        })
    }


    protected onContextMenu(evt: PointerEvent): void {
        evt.preventDefault()
    }

    public detachControl(ignored?: any): void {
        if (this.onContextMenu) {
            const inputElement = this.camera
                .getScene()
                .getEngine()
                .getInputElement()
            // eslint-disable-next-line @typescript-eslint/unbound-method
            inputElement && inputElement.removeEventListener('contextmenu', this.onContextMenu)
        }
    }


    public getClassName(): string {
        return 'ArcRotateCameraHammerJsInput'
    }

    public getSimpleName(): string {
        return 'HammerJS'
    }

    public checkInputs() {
        // this.camera.inertialRadiusOffset = -0.1
    }
}

