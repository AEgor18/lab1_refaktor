import { Button, Modal, Input } from 'antd';
import style from './ui/Modal.module.scss';

const MyModal = ({
	handleModalClick,
	title,
	openModal,
	closeModal,
	value,
	setValue,
	mutation,
}) => {
	return (
		<div onClick={handleModalClick}>
			<Modal
				title={title}
				open={openModal}
				onCancel={closeModal}
				footer={null}
			>
				<Input
					placeholder='Введите название навыка'
					value={value}
					onChange={setValue}
				/>
				<div className={style.modal}>
					<Button className={style.modalButton} onClick={closeModal}>
						Отмена
					</Button>
					<Button
						type='primary'
						className={style.button}
						onClick={mutation}
					>
						Подтвердить
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default MyModal;
