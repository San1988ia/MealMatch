type RecipeCardBaseProps = {
  title: string;
  subtitle?: string;
  tags?: readonly string[];
  imageUrl?: string;
  source?: string;
};

type WithFavorite = {
  showFavoriteButton: true;
  onToggleFavorite: () => void;
  isFavorited?: boolean;
  favoriteAriaLabel?: string;
};

type WithoutFavorite = {
  showFavoriteButton?: false;
  onToggleFavorite?: never;
  isFavorited?: never;
  favoriteAriaLabel?: never;
};

type RecipeCardLinkAction = {
  href: string;
  onClick?: never;
  openInNewTab?: boolean;
  rel?: string;
};

type RecipeCardButtonAction = {
  onClick: () => void;
  href?: never;
  openInNewTab?: never;
  rel?: never;
};

type RecipeCardProps = RecipeCardBaseProps &
  (WithFavorite | WithoutFavorite) &
  (RecipeCardLinkAction | RecipeCardButtonAction);

export function RecipeCard(props: RecipeCardProps) {
  const {
    title,
    subtitle,
    tags = [],
    imageUrl,
    source,
  } = props;

  const showFavoriteButton = props.showFavoriteButton ?? false;
  const isFavorited = showFavoriteButton ? (props.isFavorited ?? false) : false;
  const favoriteAriaLabel = showFavoriteButton
    ? (props.favoriteAriaLabel ?? "Toggle favorite")
    : "Toggle favorite";

  const cardAriaLabel = `Open recipe ${title}`;

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!props.showFavoriteButton) {
      return;
    }

    props.onToggleFavorite();
  };

  const content = (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="recipe-card__image" loading="lazy" />
      ) : (
        <div className="recipe-card__image" aria-hidden="true" />
      )}

      <div className="recipe-card__body">
        <div className="recipe-card__top">
          <h3 className="recipe-card__title">{title}</h3>

          <div className="recipe-card__actions">
            {source ? (
              <span className="recipe-card__source">{source}</span>
            ) : null}

            {showFavoriteButton ? (
              <button
                type="button"
                className={`recipe-card__favorite${isFavorited ? " recipe-card__favorite--active" : ""}`}
                aria-label={favoriteAriaLabel}
                aria-pressed={isFavorited}
                onClick={handleFavoriteClick}
              >
                {isFavorited ? (
                  <img
                    src="/images/HamburgerHeart.PNG"
                    alt=""
                    aria-hidden="true"
                    className="recipe-card__favorite-icon"
                  />
                ) : (
                  "♡"
                )}
              </button>
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
    </>
  );

  if ("href" in props) {
    const linkRel = props.openInNewTab
      ? (props.rel ?? "noopener noreferrer")
      : props.rel;

    return (
      <article className="recipe-card recipe-card--interactive">
        <a
          className="recipe-card__stretched-link"
          href={props.href}
          target={props.openInNewTab ? "_blank" : undefined}
          rel={linkRel}
          aria-label={cardAriaLabel}
        />
        {content}
      </article>
    );
  }

  return (
    <article className="recipe-card recipe-card--interactive">
      <button
        className="recipe-card__stretched-button"
        type="button"
        onClick={props.onClick}
        aria-label={cardAriaLabel}
      />
      {content}
    </article>
  );
}
