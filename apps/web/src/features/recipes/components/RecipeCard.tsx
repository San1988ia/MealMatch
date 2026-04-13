type RecipeCardProps = {
  title: string;
  subtitle?: string;
  tags?: readonly string[];
  imageUrl?: string;
  href?: string;
  source?: string;
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  favoriteAriaLabel?: string;
};

export function RecipeCard({
  title,
  subtitle,
  tags = [],
  imageUrl,
  href,
  source,
  showFavoriteButton = false,
  isFavorited = false,
  onToggleFavorite,
  favoriteAriaLabel = "Toggle favorite",
}: RecipeCardProps) {
  const handleFavoriteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onToggleFavorite?.();
  };

  const handleFavoriteKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite?.();
  };

  const content = (
    <article className="recipe-card">
      <div
        className="recipe-card__image"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        aria-hidden="true"
      />

      <div className="recipe-card__body">
        <div className="recipe-card__top">
          <h3 className="recipe-card__title">{title}</h3>

          <div className="recipe-card__actions">
            {source ? (
              <span className="recipe-card__source">{source}</span>
            ) : null}

            {showFavoriteButton ? (
              <span
                className={`recipe-card__favorite${isFavorited ? " recipe-card__favorite--active" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={favoriteAriaLabel}
                aria-pressed={isFavorited}
                onClick={handleFavoriteClick}
                onKeyDown={handleFavoriteKeyDown}
              >
                {isFavorited ? "♥" : "♡"}
              </span>
            ) : null}
          </div>
        </div>

        {subtitle ? <p className="recipe-card__subtitle">{subtitle}</p> : null}

        {tags.length > 0 ? (
          <div className="recipe-card__tags">
            {tags.map((t) => (
              <span key={t} className="recipe-card__tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <a
      className="recipe-card__link"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    content
  );
}
