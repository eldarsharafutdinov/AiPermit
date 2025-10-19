#!/usr/bin/env python3
"""
Blender Script: Create 3D Green Leaf Logo for AIPermit
Run this script in Blender's Text Editor or via command line
"""

import bpy
import bmesh
import mathutils
from mathutils import Vector
import math

def clear_scene():
    """Clear all objects from the scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_leaf_mesh():
    """Create a 3D leaf mesh with organic shape"""
    # Create a new mesh
    mesh = bpy.data.meshes.new("LeafMesh")
    obj = bpy.data.objects.new("Leaf", mesh)
    
    # Link object to scene
    bpy.context.collection.objects.link(obj)
    
    # Create bmesh instance
    bm = bmesh.new()
    
    # Create leaf vertices (organic leaf shape)
    vertices = []
    
    # Main leaf outline - more organic than perfect ellipse
    num_points = 32
    for i in range(num_points):
        angle = (i / num_points) * 2 * math.pi
        
        # Create organic leaf shape
        if i < num_points // 2:
            # Top half of leaf
            radius_x = 1.0 + 0.3 * math.sin(angle * 2)
            radius_y = 0.8 + 0.2 * math.cos(angle * 3)
        else:
            # Bottom half of leaf
            radius_x = 0.6 + 0.2 * math.sin(angle * 2)
            radius_y = 0.4 + 0.1 * math.cos(angle * 3)
        
        x = radius_x * math.cos(angle)
        y = radius_y * math.sin(angle)
        z = 0.1 * math.sin(angle * 4)  # Slight wave for organic feel
        
        vertices.append((x, y, z))
    
    # Add center point
    vertices.append((0, 0, 0))
    
    # Create faces for leaf
    for i in range(num_points):
        next_i = (i + 1) % num_points
        bm.faces.new([
            bm.verts.new(vertices[i]),
            bm.verts.new(vertices[next_i]),
            bm.verts.new(vertices[-1])  # Center point
        ])
    
    # Update mesh
    bm.to_mesh(mesh)
    bm.free()
    
    return obj

def add_leaf_veins(obj):
    """Add leaf veins as separate objects"""
    # Main center vein
    bpy.ops.mesh.primitive_cube_add(size=1)
    vein1 = bpy.context.active_object
    vein1.name = "CenterVein"
    vein1.scale = (0.05, 0.05, 1.5)
    vein1.location = (0, 0, 0)
    
    # Side veins
    for i in range(3):
        bpy.ops.mesh.primitive_cube_add(size=1)
        vein = bpy.context.active_object
        vein.name = f"SideVein_{i}"
        vein.scale = (0.03, 0.03, 0.8)
        
        angle = (i - 1) * 0.5  # -0.5, 0, 0.5
        vein.location = (0.3 * math.cos(angle), 0.3 * math.sin(angle), 0)
        vein.rotation_euler = (0, 0, angle)
    
    # Join all veins with the leaf
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    
    for vein in bpy.data.objects:
        if "Vein" in vein.name:
            vein.select_set(True)
    
    bpy.ops.object.join()

def create_materials():
    """Create materials for the leaf"""
    # Main leaf material
    leaf_mat = bpy.data.materials.new(name="LeafMaterial")
    leaf_mat.use_nodes = True
    leaf_mat.node_tree.nodes.clear()
    
    # Add nodes
    bsdf = leaf_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
    output = leaf_mat.node_tree.nodes.new(type='ShaderNodeOutputMaterial')
    
    # Connect nodes
    leaf_mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    # Set material properties
    bsdf.inputs['Base Color'].default_value = (0.0, 0.66, 0.45, 1.0)  # AIPermit green
    bsdf.inputs['Roughness'].default_value = 0.3
    bsdf.inputs['Metallic'].default_value = 0.0
    
    # Add some subsurface scattering for realistic leaf look
    bsdf.inputs['Subsurface'].default_value = 0.1
    bsdf.inputs['Subsurface Color'].default_value = (0.0, 0.8, 0.4, 1.0)
    
    return leaf_mat

def setup_lighting():
    """Setup lighting for the scene"""
    # Clear existing lights
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type == 'LIGHT':
            obj.select_set(True)
            bpy.ops.object.delete()
    
    # Add key light
    bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
    key_light = bpy.context.active_object
    key_light.data.energy = 3
    key_light.data.color = (1.0, 0.95, 0.8)
    
    # Add fill light
    bpy.ops.object.light_add(type='AREA', location=(-3, -2, 4))
    fill_light = bpy.context.active_object
    fill_light.data.energy = 1
    fill_light.data.color = (0.8, 0.9, 1.0)
    fill_light.data.size = 5

def setup_camera():
    """Setup camera for rendering"""
    # Clear existing cameras
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type == 'CAMERA':
            obj.select_set(True)
            bpy.ops.object.delete()
    
    # Add camera
    bpy.ops.object.camera_add(location=(0, -3, 2))
    camera = bpy.context.active_object
    camera.rotation_euler = (math.radians(60), 0, 0)
    
    # Set as active camera
    bpy.context.scene.camera = camera

def setup_render_settings():
    """Setup render settings for high quality output"""
    scene = bpy.context.scene
    
    # Set render engine to Cycles for better materials
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 128
    
    # Set output settings
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.filepath = "/tmp/aipermit_leaf_logo.png"
    
    # Enable transparency
    scene.render.film_transparent = True

def add_environment():
    """Add environment for better lighting"""
    # Add world material
    world = bpy.context.scene.world
    world.use_nodes = True
    world.node_tree.nodes.clear()
    
    # Add background node
    bg_node = world.node_tree.nodes.new(type='ShaderNodeBackground')
    output_node = world.node_tree.nodes.new(type='ShaderNodeOutputWorld')
    
    # Connect nodes
    world.node_tree.links.new(bg_node.outputs['Background'], output_node.inputs['Surface'])
    
    # Set background color (light green tint)
    bg_node.inputs['Color'].default_value = (0.8, 0.95, 0.85, 1.0)
    bg_node.inputs['Strength'].default_value = 0.5

def main():
    """Main function to create the 3D leaf logo"""
    print("Creating 3D AIPermit Leaf Logo...")
    
    # Clear scene
    clear_scene()
    
    # Create leaf mesh
    leaf_obj = create_leaf_mesh()
    
    # Add veins
    add_leaf_veins(leaf_obj)
    
    # Create and assign material
    leaf_mat = create_materials()
    leaf_obj.data.materials.append(leaf_mat)
    
    # Setup scene
    setup_lighting()
    setup_camera()
    setup_render_settings()
    add_environment()
    
    # Add some organic deformation
    bpy.context.view_layer.objects.active = leaf_obj
    bpy.ops.object.modifier_add(type='SUBSURF')
    leaf_obj.modifiers["Subdivision Surface"].levels = 2
    
    # Add slight random deformation for organic look
    bpy.ops.object.modifier_add(type='DISPLACE')
    displace_mod = leaf_obj.modifiers["Displace"]
    displace_mod.strength = 0.1
    
    # Create noise texture for displacement
    noise_tex = bpy.data.textures.new("NoiseTex", type='NOISE')
    noise_tex.noise_scale = 2.0
    displace_mod.texture = noise_tex
    
    print("3D Leaf Logo created successfully!")
    print("Render the scene to save the logo image.")
    
    # Optional: Render the image
    # bpy.ops.render.render(write_still=True)

if __name__ == "__main__":
    main()






