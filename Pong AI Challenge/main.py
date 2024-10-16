import pygame
from pygame.locals import *
from sys import exit

pygame.init()

# Set up the game screen
screen = pygame.display.set_mode((640, 480), 0, 32)
pygame.display.set_caption("Pong: AI Challenge")  # Initialize with scores

# Create surfaces for the game elements
back = pygame.Surface((640, 480))
background = back.convert()
background.fill((0, 0, 0))

bar = pygame.Surface((10, 50))
bar1 = bar.convert()
bar1.fill((0, 0, 255))

bar2 = bar.convert()
bar2.fill((255, 0, 0))

circ_sur = pygame.Surface((15, 15))
pygame.draw.circle(circ_sur, (0, 255, 0), (7, 7), 7)
circle = circ_sur.convert()
circle.set_colorkey((0, 0, 0))

# Button creation
button_surface = pygame.Surface((640, 50))
button_surface.fill((50, 50, 50))  # Set the same color as the top bar

start_button = pygame.Rect(10, 440, 100, 30)
stop_button = pygame.Rect(260, 440, 100, 30)
exit_button = pygame.Rect(510, 440, 100, 30)

# Initial positions of paddles and ball
bar1_x, bar2_x = 10., 620.
bar1_y, bar2_y = 215., 215.
circle_x, circle_y = 307.5, 232.5

# Movement speeds and score
bar1_move, bar2_move = 0., 0.
speed_x, speed_y, speed_circ = 400., 400., 400.
bar1_score, bar2_score = 0, 0

# Difficulty settings
difficulty_multiplier = 1.0  # Control the difficulty level
difficulty_increment = 0.1  # Amount to increase difficulty after each score

clock = pygame.time.Clock()
font = pygame.font.SysFont("times new roman", 20)

game_running = False  # Flag to control game state

# Constants
BAR_HEIGHT = 50  # Height of the paddle/bar
BALL_DIAMETER = 15  # Diameter of the ball
BALL_RADIUS = BALL_DIAMETER // 2  # Radius of the ball

while True:
    for event in pygame.event.get():
        if event.type == QUIT:
            exit()
        if event.type == KEYDOWN:
            if event.key == K_UP:
                bar1_move = -speed_circ * 0.01
            elif event.key == K_DOWN:
                bar1_move = speed_circ * 0.01
        elif event.type == KEYUP:
            if event.key == K_UP or event.key == K_DOWN:
                bar1_move = 0.
        elif event.type == MOUSEBUTTONDOWN:
            if start_button.collidepoint(event.pos):
                game_running = True  # Start the game
            elif stop_button.collidepoint(event.pos):
                game_running = False  # Stop the game
            elif exit_button.collidepoint(event.pos):
                exit()  # Exit the game

    # Clear screen and redraw background
    screen.blit(background, (0, 0))

    # Draw game frame and middle line
    frame = pygame.draw.rect(screen, (255, 255, 255), Rect((5, 5), (630, 420)), 2)
    middle_line = pygame.draw.aaline(screen, (255, 255, 255), (330, 5), (330, 475))

    # Draw paddles and ball
    screen.blit(bar1, (bar1_x, bar1_y))
    screen.blit(bar2, (bar2_x, bar2_y))
    screen.blit(circle, (circle_x, circle_y))

    # Draw scores
    score1 = font.render(str(bar1_score), True, (255, 255, 255))
    score2 = font.render(str(bar2_score), True, (255, 255, 255))
    screen.blit(score1, (250., 210.))
    screen.blit(score2, (380., 210.))

    # Draw button surface
    screen.blit(button_surface, (0, 430))

    # Draw border around the button surface
    border_rect = pygame.Rect(0, 430, 640, 50)
    pygame.draw.rect(screen, (30, 30, 30), border_rect, 2)

    # Add buttons
    pygame.draw.rect(screen, (0, 200, 0), start_button)
    pygame.draw.rect(screen, (255, 255, 255), start_button, 2)
    pygame.draw.rect(screen, (200, 0, 0), stop_button)
    pygame.draw.rect(screen, (255, 255, 255), stop_button, 2)
    pygame.draw.rect(screen, (0, 0, 200), exit_button)
    pygame.draw.rect(screen, (255, 255, 255), exit_button, 2)

    # Add button text
    start_text = font.render("Start", True, (255, 255, 255))
    stop_text = font.render("Stop", True, (255, 255, 255))
    exit_text = font.render("Exit", True, (255, 255, 255))

    # Get text dimensions and position them
    start_text_rect = start_text.get_rect(center=(start_button.centerx, start_button.centery))
    stop_text_rect = stop_text.get_rect(center=(stop_button.centerx, stop_button.centery))
    exit_text_rect = exit_text.get_rect(center=(exit_button.centerx, exit_button.centery))

    screen.blit(start_text, start_text_rect)
    screen.blit(stop_text, stop_text_rect)
    screen.blit(exit_text, exit_text_rect)

    # Game logic
    if game_running:
        # Update the position of the first paddle
        bar1_y += bar1_move
        bar1_y = max(10, min(bar1_y, 420))  # Limit paddle movement

        # Increase speed based on difficulty
        speed_x *= (1 + difficulty_multiplier * 0.0001)
        speed_y *= (1 + difficulty_multiplier * 0.0001)

        # Update ball position
        time_passed = clock.tick(60)
        time_sec = time_passed / 1000.0
        circle_x += speed_x * time_sec
        circle_y += speed_y * time_sec
        ai_speed = speed_circ * time_sec * (0.5 + difficulty_multiplier * 0.2)

        # Simple AI for the second paddle
        if circle_x >= 305.:
            distance_to_paddle = bar2_y + 25 - circle_y  # Calculate distance to ball
            predicted_ball_y = circle_y + (speed_y * (0.5 * (circle_x - bar2_x) / speed_x))  # Predict ball position

            # Smoothly adjust AI paddle position based on the predicted ball position
            if bar2_y < predicted_ball_y - 20:
                bar2_y += ai_speed
            elif bar2_y > predicted_ball_y + 20:
                bar2_y -= ai_speed

            # Limit AI paddle movement speed
            if bar2_y < 10:
                bar2_y = 10
            elif bar2_y > 420:
                bar2_y = 420

        # Boundaries for paddles
        bar1_y = max(10, min(bar1_y, 420))
        bar2_y = max(10, min(bar2_y, 420))

        # Ball collision with paddles
        if circle_x <= bar1_x + 10.:
            if bar1_y - 7.5 <= circle_y <= bar1_y + 42.5:
                circle_x = 20.
                speed_x = -speed_x
                # Calculate hit position
                hit_position = (circle_y - (bar1_y + 25)) / (BAR_HEIGHT // 2)  # Center the bar at 25
                # Ensure speed_y is calculated correctly
                hit_position_scaled = hit_position * float(speed_x) / (BAR_HEIGHT // 2)  # Calculul scalat
                speed_y = max(-float(speed_x), min(float(speed_x), hit_position_scaled))  # Convert to float for safety
        if circle_x >= bar2_x - 15.:
            if bar2_y - 7.5 <= circle_y <= bar2_y + 42.5:
                circle_x = 605.
                speed_x = -speed_x
                # Calculate hit position
                hit_position = (circle_y - (bar2_y + 25)) / (BAR_HEIGHT // 2)  # Center the bar at 25
                # Ensure speed_y is calculated correctly
                hit_position_scaled = hit_position * float(speed_x) / (BAR_HEIGHT // 2)  # Calculul scalat
                speed_y = max(-float(speed_x), min(float(speed_x), hit_position_scaled))  # Convert to float for safety

        # Scoring logic
        if circle_x < 5.:
            bar2_score += 1
            circle_x = bar2_x - 15  # Reset ball position to just in front of player 2
            circle_y = bar2_y + 12.5  # Center it vertically with player 2's paddle
            bar1_y, bar2_y = 215., 215.
            speed_x = 300.  # Ball moves towards player 1
            speed_y = 300.  # Ball moves downward
            difficulty_multiplier += difficulty_increment  # Increase difficulty on score

        elif circle_x > 635.:
            bar1_score += 1
            circle_x = bar1_x + 10  # Reset ball position to just in front of player 1
            circle_y = bar1_y + 12.5  # Center it vertically with player 1's paddle
            bar1_y, bar2_y = 215., 215.
            speed_x = -300.  # Ball moves towards player 2
            speed_y = 300.  # Ball moves downward
            difficulty_multiplier += difficulty_increment  # Increase difficulty on score

        # Ball collision with top and bottom walls
        if circle_y <= 10 + BALL_RADIUS or circle_y >= 420 - BALL_RADIUS:
            speed_y = -speed_y

    pygame.display.update()
