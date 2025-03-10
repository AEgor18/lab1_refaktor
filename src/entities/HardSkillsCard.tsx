import React, { ReactNode } from 'react';
import { Button } from 'antd';
import style from './HardSkills/HardSkillsCard.module.scss';

interface HardSkillsCardProps {
	activeID: number | null | undefined;
	searchValue: string;
	filteredUl: ReactNode;
	setActive: (id: number | null) => void;
	handleOpenAddModal: () => void;
	handleDeleteMutation: () => void;
	handleOpenChangeModal: () => void;
	onSetSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HardSkillsCard: React.FC<HardSkillsCardProps> = ({
	handleOpenAddModal,
	activeID,
	handleDeleteMutation,
	handleOpenChangeModal,
	searchValue,
	filteredUl,
	onSetSearchValue,
}) => {
	return (
		<>
			<div className={style.functional}>
				<Button
					type='primary'
					className={style.button}
					onClick={handleOpenAddModal}
				>
					Добавить
				</Button>

				{activeID && (
					<>
						<Button
							type='primary'
							className={style.button}
							onClick={handleDeleteMutation}
						>
							Удалить
						</Button>
						<Button
							type='primary'
							className={style.button}
							onClick={handleOpenChangeModal}
						>
							Изменить
						</Button>
					</>
				)}
				<input
					type='text'
					placeholder='Поиск навыков'
					className={style.input}
					value={searchValue}
					onChange={onSetSearchValue}
				/>
			</div>
			<ul className={style.list}>{filteredUl}</ul>
		</>
	);
};

export default HardSkillsCard;
