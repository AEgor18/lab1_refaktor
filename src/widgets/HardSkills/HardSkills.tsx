'use client';
import React, { useRef, useState } from 'react';
import { useMutation, useQuery, QueryClient } from 'react-query';
import { Spin } from 'antd';
import style from './HardSkills.module.scss';
import {
	fetchHardSkills,
	addHardSkill,
	deleteHardSKill,
	updateHardSkill,
} from '../../api/api';
import MyModal from '../../entities/Modal/MyModal';

import HardSkillsCard from '../../entities/HardSkillsCard';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
});

const HardSkills: React.FC = () => {
	const [activeID, setActive] = useState<number | null>(null);
	const [searchValue, setSearchValue] = useState<string>('');
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const [addModal, setAddModal] = useState<boolean>(false);
	const [addValue, setAddValue] = useState<string>('');
	const [changeModal, setChangeModal] = useState<boolean>(false);
	const [changeValue, setChangeValue] = useState<string>('');

	const {
		data: hardSkills,
		isLoading,
		error,
	} = useQuery(['hardSkills'], () => fetchHardSkills(), {
		refetchOnWindowFocus: false,
		retry: false,
	});

	const addMutation = useMutation((title: string) => addHardSkill(title), {
		onSuccess: () => {
			queryClient.invalidateQueries(['hardSkills']);
			setAddModal(false);
			setAddValue('');
		},
		onError: (error) => {
			console.error('Ошибка при добавлении навыка:', error);
		},
	});

	const deleteMutation = useMutation(deleteHardSKill, {
		onSuccess: () => {
			queryClient.invalidateQueries(['hardSkills']);
			setActive(null);
		},
		onError: (error) => {
			console.error('Ошибка при удалении навыка:', error);
		},
	});

	const updateMutataion = useMutation(
		(title: string) => {
			if (activeID === null) {
				throw new Error('activeID не должен быть null');
			}
			return updateHardSkill(activeID, title);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['hardSkills']);
				setActive(null);
				setChangeModal(false);
				setChangeValue('');
			},
			onError: (error) => {
				console.error('Ошибка при обновлении навыка:', error);
			},
		}
	);

	const handleClick = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (
			wrapperRef.current &&
			!wrapperRef.current.contains(event.target as Node)
		) {
			setActive(null);
		}
	};

	const filteredHardSkills = hardSkills?.filter((skill) => {
		return skill.Title.toLowerCase().includes(searchValue.toLowerCase());
	});

	if (isLoading) return <Spin size='large' className={style.spin} />;

	if (error) {
		return <div className={style.empty}>Нет доступных навыков</div>;
	}

	const handleDeleteMutation = () => {
		if (activeID) {
			deleteMutation.mutate(activeID);
		}
	};

	const handleUpdateMutation = () => {
		if (changeValue.length > 0) {
			updateMutataion.mutate(changeValue);
		}
	};

	const handleAddMutation = () => {
		if (addValue.length > 0) {
			addMutation.mutate(addValue);
		}
	};

	const handleOpenChangeModal = () => {
		setChangeModal(true);
	};

	const handleCloseChangeModal = () => {
		setChangeModal(false);
	};

	const handleOpenAddModal = () => {
		setAddModal(true);
	};

	const handleCloseAddModal = () => {
		setAddModal(false);
	};

	const isFilteredHardSkills = (filteredHardSkills ?? []).length > 0;

	const filteredUl = () => {
		if (isFilteredHardSkills) {
			return renderSkillsList(filteredHardSkills, activeID, setActive);
		} else {
			return renderNotFoundMessage();
		}
	};

	const renderSkillItem = (skill, activeID: number, setActive: any) => {
		const StyleId = activeID === skill.Hard_skillID ? style.active : '';

		const onSetActive = () => {
			setActive(skill.Hard_skillID);
		};

		return (
			<li
				key={skill.Hard_skillID}
				className={`${style.item} ${StyleId}`}
				onClick={onSetActive}
			>
				{skill.Title}
			</li>
		);
	};

	const renderSkillsList = (
		filteredHardSkills: any,
		activeID: number,
		setActive: any
	) => {
		if (!filteredHardSkills) {
			return null;
		}
		return filteredHardSkills?.map((skill: any) =>
			renderSkillItem(skill, activeID, setActive)
		);
	};

	const renderNotFoundMessage = () => {
		return <div className={style.skillsNotFound}>Навыки не найдены</div>;
	};

	const onSetAddValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddValue(e.target.value);
	};

	const onSetSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const onSetChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChangeValue(e.target.value);
	};

	const handleModalClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div className={style.hidden} onClick={handleClick}>
			<div className={style.wrapper} ref={wrapperRef}>
				<HardSkillsCard
					activeID={activeID}
					searchValue={searchValue}
					filteredUl={filteredUl()}
					setActive={setActive}
					handleOpenAddModal={handleOpenAddModal}
					handleDeleteMutation={handleDeleteMutation}
					handleOpenChangeModal={handleOpenChangeModal}
					onSetSearchValue={onSetSearchValue}
				/>
				{addModal && (
					<MyModal
						handleModalClick={handleModalClick}
						title='Добавить навык'
						openModal={addModal}
						closeModal={handleCloseAddModal}
						value={addValue}
						setValue={onSetAddValue}
						mutation={handleAddMutation}
					/>
				)}
				{changeModal && (
					<MyModal
						handleModalClick={handleModalClick}
						title='Изменить навык'
						openModal={changeModal}
						closeModal={handleCloseChangeModal}
						value={changeValue}
						setValue={onSetChangeValue}
						mutation={handleUpdateMutation}
					/>
				)}
			</div>
		</div>
	);
};

export default HardSkills;
