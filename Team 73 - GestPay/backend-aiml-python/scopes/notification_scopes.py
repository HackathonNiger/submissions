from sqlalchemy.orm import Session
import models
from datetime import datetime, timezone

def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notif_type: str = "general"
):
    """
    Create a new notification for a user.
    """
    notification = models.Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_notifications(db: Session, user_id: int, skip: int = 0, limit: int = 20):
    """
    Fetch notifications for a given user.
    """
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == user_id)
        .order_by(models.Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_unread_notifications(db: Session, user_id: int):
    """
    Fetch all unread notifications for a user.
    """
    return (
        db.query(models.Notification)
        .filter(models.Notification.user_id == user_id, models.Notification.is_read == False)
        .order_by(models.Notification.created_at.desc())
        .all()
    )


def mark_notification_as_read(db: Session, notification_id: int):
    """
    Mark a single notification as read.
    """
    notif = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
        db.refresh(notif)
    return notif


def mark_all_notifications_as_read(db: Session, user_id: int):
    """
    Mark all notifications for a user as read.
    """
    notifs = db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).all()

    for notif in notifs:
        notif.is_read = True
    
    db.commit()
    return notifs
