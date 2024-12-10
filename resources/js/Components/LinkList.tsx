import { Input } from '@/Components/ui/input';
import { Link, Links } from '@/Pages/Dashboard';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

function LinkItem({ link }: { link: Link }) {
    const [isEditing, setIsEditing] = useState(false);
    const [imageStatus, setImageStatus] = useState({
        loaded: false,
        success: true,
    });

    const { data, put, setData, processing } = useForm({
        title: link.title ?? '',
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (link.title === data.title) {
            setIsEditing(!isEditing);
            return;
        }
        put(`/links/${link.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(!isEditing);
            },
        });
    };

    useEffect(() => {
        if (link.title !== data.title && link.title) {
            setData('title', link.title);
        }
    }, [link.title]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    console.debug(link.image, imageStatus.success, imageStatus.loaded);
    const showImage = link.image && imageStatus.success;
    return (
        <div
            className={
                'grid grid-rows-[10rem_1fr] rounded-md border border-border sm:grid-rows-[12rem_1fr] md:grid-cols-[minmax(0,8rem),1fr] md:grid-rows-1'
            }
            key={link.id}
        >
            <div className={'overflow-hidden rounded-sm'}>
                <div
                    style={{
                        opacity: imageStatus.loaded || !link.image ? 1 : 0,
                        height: imageStatus.success && link.image ? 0 : '100%',
                    }}
                    className={
                        'h-full bg-gradient-to-r from-indigo-500 transition duration-500'
                    }
                />
                {showImage && (
                    <img
                        style={{
                            opacity: imageStatus.loaded ? 1 : 0,
                            zIndex: imageStatus.success ? 10 : 'initial',
                        }}
                        alt={link.title}
                        src={link.image}
                        onLoad={() =>
                            setImageStatus({ ...imageStatus, loaded: true })
                        }
                        onError={() =>
                            setImageStatus({ loaded: true, success: false })
                        }
                        className={
                            'relative h-full max-h-full min-h-0 w-full object-cover transition duration-500'
                        }
                    />
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className={
                    'prose grid min-h-[4.5rem] max-w-none grid-cols-[minmax(0,1fr)_auto] items-center py-2 pl-2 dark:prose-invert md:min-h-0'
                }
            >
                {isEditing ? (
                    <div>
                        <Input
                            ref={inputRef}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={'bg-transparent px-2'}
                            placeholder={link.title}
                        />
                    </div>
                ) : (
                    <div className={'overflow-hidden px-2'}>
                        <a
                            rel="noreferrer"
                            target={'_blank'}
                            href={link.original_url}
                        >
                            {link.title ?? link.original_url}
                        </a>
                    </div>
                )}

                <div
                    className={
                        'flex items-center justify-center px-2 pr-4 md:px-4'
                    }
                >
                    {isEditing ? (
                        <button
                            key={'submit_button'}
                            type={'submit'}
                            className={'size-4'}
                        >
                            <CheckIcon className={'size-4'} />
                        </button>
                    ) : (
                        <button
                            key={'edit_button'}
                            type={'button'}
                            onClick={() => setIsEditing(true)}
                        >
                            <PencilSquareIcon className={'size-4'} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function LinkList({ links }: { links: Links }) {
    return (
        <div
            className={
                'mx-auto mt-8 grid w-full max-w-7xl gap-8 p-4 md:auto-rows-[minmax(0,4rem)]'
            }
        >
            {links.map((link) => (
                <LinkItem link={link} key={link.path} />
            ))}
        </div>
    );
}
