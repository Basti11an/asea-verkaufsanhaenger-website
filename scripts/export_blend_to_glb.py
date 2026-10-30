import sys
from pathlib import Path

import bpy


def script_arguments() -> list[str]:
    if "--" not in sys.argv:
        return []
    return sys.argv[sys.argv.index("--") + 1 :]


arguments = script_arguments()
if not arguments:
    raise RuntimeError("Expected an output path after --")

output_path = Path(arguments[0]).resolve()
prefixes = tuple(arguments[1:])
output_path.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.object.select_all(action="DESELECT")
selected_count = 0

for scene_object in bpy.context.scene.objects:
    if scene_object.type != "MESH":
        continue
    if prefixes and not scene_object.name.startswith(prefixes):
        continue
    scene_object.hide_set(False)
    scene_object.hide_viewport = False
    scene_object.hide_render = False
    scene_object.select_set(True)
    selected_count += 1

if selected_count == 0:
    raise RuntimeError(f"No mesh objects matched prefixes: {prefixes}")

bpy.ops.export_scene.gltf(
    filepath=str(output_path),
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
)

print(f"Exported {selected_count} mesh objects to {output_path}")
