import cv2

def capture_video(stop_event):
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open video stream")
        return

    print("Press 'q' to stop recording")

    while cap.isOpened() and not stop_event.is_set():
        ret, frame = cap.read()
        if ret:
            cv2.imshow('Video', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                stop_event.set()
                break
        else:
            break

    cap.release()
    cv2.destroyAllWindows()
