import {
  Toast,
  Modal
} from 'antd-mobile';
import {
  registerFeedback
} from '@saas-plat/metaui';

registerFeedback({
  // 轻信息，无操作自动消失
  message: (content, duration, type, onClose) => {
    switch (type) {
    case 'info':
      Toast.info(content, duration, onClose)
      break;
    case 'error':
      Toast.error(content, duration, onClose)
      break;
    case 'warning':
      Toast.warning(content, duration, onClose)
      break;
    case 'loading':
      Toast.loading(content, duration, onClose)
      break;
    default:
      Toast.success(content, duration, onClose)
      break;
    }
    return () => Toast.hide();
  },
  // 警告
  alert: (title, content, type, okText, onOk) => {
    let modal;
    switch (type) {
    case 'success':
      modal = Modal.alert(
        title,
        content, [{
          text: okText,
          onPress: onOk,
          style: 'primary'
        }]
      );
      break;
    case 'error':
      modal = Modal.alert(
        title,
        content, [{
          text: okText,
          onPress: onOk,
          style: 'warning'
        }]
      );
      break;
    case 'warning':
      modal = Modal.alert(
        title,
        content, [{
          text: okText,
          onPress: onOk
        }]
      );
      break;
    case 'loading':
      modal = Modal.alert(
        title,
        content, [{
          text: okText,
          onPress: onOk,
          loading: true
        }]
      );
      break;
    default:
      modal = Modal.alert(
        title,
        content, [{
          text: okText,
          onPress: onOk
        }]
      );
      break;
    }
    return () => modal.close();
  },
  // 确认是否
  confirm: (title, content, okText, cancelText, onOk, onCancel) => {
    const modal = Modal.alert(
      title,
      content, [{
          text: okText,
          onPress: onOk,
          style: 'primary'
        },
        {
          text: cancelText,
          onPress: onCancel
        }
      ]
    );
    return () => modal.close();
  },
  // 安全确认，需要输入安全码
  secure: (title, placeholder, okText, cancelText, onOk, onCancel) => {
    const modal = Modal.prompt(
      title,
      placeholder,
      onOk, [{
          text: cancelText,
          onPress: onOk
        },
        {
          text: okText,
          onPress: onCancel
        },
      ],
      'secure-text',
    );
    return () => modal.close();
  },
  // 提醒
  notification: (message, description, duration, onClose, btns, onClick) => {
    const modal = Modal.alert(
      message,
      description,
      btns.map(({
        key,
        text,
        type
      }) => ({
        text: text,
        style: type,
        onPress: () => {
          modal.close();
          onClick(key);
        }
      }))
    );
    setTimeout(() => {
      modal.close();
    }, duration);
    return () => modal.close();
  }
})
