from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from app.models import Order  # Replace 'app' with your actual app name if different

@shared_task
def send_order_confirmation_email(order_id):
    try:
        order = Order.objects.get(id=order_id)
        subject = f"Order Confirmation - #{order.id}"
        message = f"Hi {order.user.email},\n\nYour order has been placed successfully!"
        recipient_list = [order.user.email]
        from_email = settings.DEFAULT_FROM_EMAIL

        send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,
        )

        return f"Email sent to {order.user.email}"

    except Order.DoesNotExist:
        return f"Order with ID {order_id} does not exist."
    except Exception as e:
        return f"Failed to send email: {str(e)}"
