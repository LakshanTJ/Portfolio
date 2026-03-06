import cv2
import numpy as np
import os

width, height = 1920, 1080
fps = 30
duration = 10  # Seconds
total_frames = fps * duration

# Create a VideoWriter object with VP09 codec for WebM, highly compatible with HTML5
out = cv2.VideoWriter('futuristic_bg.webm', cv2.VideoWriter_fourcc(*'VP09'), fps, (width, height))

# Style configuration
bg_color = (10, 10, 10)  # BGR format (dark gray/black)
grid_color = (0, 106, 255)  # BGR format for #ff6a00 (Neon Orange)
grid_size = 50

# Particle settings
num_particles = 100
particles = []
for _ in range(num_particles):
    x = np.random.randint(0, width)
    y = np.random.randint(0, height)
    speed_y = np.random.uniform(0.5, 2.0)
    particles.append([x, y, speed_y])

for frame_idx in range(total_frames):
    # Create blank canvas
    frame = np.full((height, width, 3), bg_color, dtype=np.uint8)
    
    # Calculate animation offset for seamless loop (0 to grid_size)
    progress = frame_idx / total_frames
    offset_y = int(progress * grid_size * 4) % grid_size
    
    # --- Draw Moving Grid (Sci-Fi Floor/Wall effect) ---
    # Vertical lines (static for simplicity, glowing)
    for x in range(0, width, grid_size):
        # Base line
        cv2.line(frame, (x, 0), (x, height), (0, 30, 80), 1)
        
    # Horizontal lines (moving down)
    for y in range(0, height + grid_size, grid_size):
        y_pos = y + offset_y
        if y_pos < height:
            # Opacity fades near top and bottom
            alpha = np.sin(np.pi * (y_pos / height)) 
            color = (int(grid_color[0] * alpha * 0.3), int(grid_color[1] * alpha * 0.3), int(grid_color[2] * alpha * 0.3))
            cv2.line(frame, (0, y_pos), (width, y_pos), color, 1)

    # --- Draw Particles (Data points moving up) ---
    for i in range(num_particles):
        x, y, speed_y = particles[i]
        
        # Calculate new Y
        # To make it loop, we want the particles to reset smoothly. 
        # A simpler way is just to let them wrap around since it's abstract.
        new_y = (y - speed_y * (frame_idx / fps) * 60) % height
        
        # Glow effect: Draw a larger faint circle, then a small bright one
        alpha = np.sin(np.pi * (new_y / height)) # Fade at edges
        
        glow_color = (int(grid_color[0] * alpha * 0.5), int(grid_color[1] * alpha * 0.5), int(grid_color[2] * alpha * 0.5))
        core_color = (int(grid_color[0] * alpha), int(grid_color[1] * alpha), int(grid_color[2] * alpha))
        
        if alpha > 0.1:
            cv2.circle(frame, (int(x), int(new_y)), 3, glow_color, -1)
            cv2.circle(frame, (int(x), int(new_y)), 1, core_color, -1)
            
    # --- Subtle Scanning Line ---
    scan_y = int(progress * height * 2) % height
    cv2.line(frame, (0, scan_y), (width, scan_y), (0, 50, 150), 2) # Faint orange scanline
    
    # Optional vignette (darken edges)
    # Creating a simple vignette using a pre-calculated mask would be faster, but let's keep it simple.

    out.write(frame)

out.release()
print("Video generated successfully: futuristic_bg.webm")
